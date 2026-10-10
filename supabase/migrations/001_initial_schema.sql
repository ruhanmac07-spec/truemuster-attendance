-- TRUEMUSTER — Migration 001: Initial Relational Schema & Atomic Procedures
-- Database: PostgreSQL (Supabase)

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. User Profiles & Roles
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('student', 'teacher', 'admin')),
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Student Records
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    enrollment_id TEXT NOT NULL UNIQUE,
    department TEXT NOT NULL,
    batch TEXT NOT NULL,
    active_device_id UUID,
    device_bound_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Teacher Records
CREATE TABLE IF NOT EXISTS public.teachers (
    id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    employee_id TEXT NOT NULL UNIQUE,
    department TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Classroom Locations & Anchors
CREATE TABLE IF NOT EXISTS public.classroom_locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_number TEXT NOT NULL,
    building TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    radius_metres DOUBLE PRECISION NOT NULL DEFAULT 100.0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Courses and Sections
CREATE TABLE IF NOT EXISTS public.course_sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_code TEXT NOT NULL,
    course_name TEXT NOT NULL,
    section TEXT NOT NULL,
    department TEXT NOT NULL,
    semester INT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (course_code, section)
);

-- 6. Teacher Assignments
CREATE TABLE IF NOT EXISTS public.teacher_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID NOT NULL REFERENCES public.teachers(id) ON DELETE CASCADE,
    course_section_id UUID NOT NULL REFERENCES public.course_sections(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (teacher_id, course_section_id)
);

-- 7. Registered Devices (One Active Device Per Student Constraint)
CREATE TABLE IF NOT EXISTS public.registered_devices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    device_fingerprint TEXT NOT NULL,
    device_name TEXT NOT NULL,
    os_version TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('active', 'revoked', 'pending_transfer')),
    registered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    revoked_at TIMESTAMPTZ
);

-- Partial unique index ensuring at most ONE active device per student
CREATE UNIQUE INDEX IF NOT EXISTS idx_one_active_device_per_student 
ON public.registered_devices(student_id) 
WHERE status = 'active';

-- 8. Attendance Sessions
CREATE TABLE IF NOT EXISTS public.attendance_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_section_id UUID NOT NULL REFERENCES public.course_sections(id),
    teacher_id UUID NOT NULL REFERENCES public.teachers(id),
    classroom_location_id UUID NOT NULL REFERENCES public.classroom_locations(id),
    scheduled_start TIMESTAMPTZ NOT NULL,
    scheduled_end TIMESTAMPTZ NOT NULL,
    state TEXT NOT NULL CHECK (state IN ('scheduled', 'active', 'closed', 'finalized')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Dynamic QR Challenges (90s validity)
CREATE TABLE IF NOT EXISTS public.qr_challenges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES public.attendance_sessions(id) ON DELETE CASCADE,
    token TEXT NOT NULL UNIQUE,
    issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    is_consumed BOOLEAN NOT NULL DEFAULT FALSE
);

-- 10. Check-in Attempts (45s deadline)
CREATE TABLE IF NOT EXISTS public.checkin_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES public.attendance_sessions(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    challenge_id UUID NOT NULL REFERENCES public.qr_challenges(id),
    status TEXT NOT NULL CHECK (status IN ('attempt_accepted', 'location_pending', 'auth_pending', 'evidence_submitting', 'confirmed', 'location_failed', 'auth_failed', 'expired', 'needs_review')),
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deadline_at TIMESTAMPTZ NOT NULL,
    distance_metres DOUBLE PRECISION,
    outcome_reason TEXT,
    committed_at TIMESTAMPTZ
);

-- 11. Authoritative Attendance Records (One Record Per Student Per Session)
CREATE TABLE IF NOT EXISTS public.attendance_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES public.attendance_sessions(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'excused', 'pending_review')),
    verification_method TEXT NOT NULL CHECK (verification_method IN ('qr_biometric_geofence', 'teacher_manual_override', 'admin_correction')),
    verified_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    override_reason TEXT,
    override_by UUID REFERENCES public.profiles(id),
    UNIQUE (session_id, student_id)
);

-- 12. Audit Logs
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID REFERENCES public.profiles(id),
    action TEXT NOT NULL,
    target_resource TEXT NOT NULL,
    details JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. Atomic Stored Procedure: Calculate Distance (Haversine in Metres)
CREATE OR REPLACE FUNCTION calculate_distance_metres(
    lat1 DOUBLE PRECISION, lon1 DOUBLE PRECISION,
    lat2 DOUBLE PRECISION, lon2 DOUBLE PRECISION
) RETURNS DOUBLE PRECISION AS $$
DECLARE
    r DOUBLE PRECISION := 6371000.0; -- Earth radius in metres
    phi1 DOUBLE PRECISION;
    phi2 DOUBLE PRECISION;
    delta_phi DOUBLE PRECISION;
    delta_lambda DOUBLE PRECISION;
    a DOUBLE PRECISION;
    c DOUBLE PRECISION;
BEGIN
    phi1 := radians(lat1);
    phi2 := radians(lat2);
    delta_phi := radians(lat2 - lat1);
    delta_lambda := radians(lon2 - lon1);

    a := sin(delta_phi / 2.0)^2 + cos(phi1) * cos(phi2) * sin(delta_lambda / 2.0)^2;
    c := 2.0 * atan2(sqrt(a), sqrt(1.0 - a));
    RETURN r * c;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 14. Atomic Stored Procedure: Verify Evidence and Commit Attendance
CREATE OR REPLACE FUNCTION verify_and_commit_attendance(
    p_attempt_id UUID,
    p_student_id UUID,
    p_latitude DOUBLE PRECISION,
    p_longitude DOUBLE PRECISION,
    p_accuracy_metres DOUBLE PRECISION,
    p_biometric_success BOOLEAN
) RETURNS JSONB AS $$
DECLARE
    v_attempt RECORD;
    v_session RECORD;
    v_location RECORD;
    v_device RECORD;
    v_distance DOUBLE PRECISION;
    v_now TIMESTAMPTZ := NOW();
BEGIN
    -- 1. Retrieve Attempt
    SELECT * INTO v_attempt FROM public.checkin_attempts WHERE id = p_attempt_id FOR UPDATE;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'status', 'rejected', 'message', 'Check-in attempt not found');
    END IF;

    IF v_attempt.student_id <> p_student_id THEN
        RETURN jsonb_build_object('success', false, 'status', 'rejected', 'message', 'Unauthorized attempt mismatch');
    END IF;

    -- 2. Verify 45-second deadline
    IF v_now > v_attempt.deadline_at THEN
        UPDATE public.checkin_attempts 
        SET status = 'expired', outcome_reason = 'Attempt exceeded 45-second deadline' 
        WHERE id = p_attempt_id;
        RETURN jsonb_build_object('success', false, 'status', 'expired', 'message', 'Check-in attempt expired (> 45s)');
    END IF;

    -- 3. Verify Active Registered Device
    SELECT * INTO v_device FROM public.registered_devices 
    WHERE student_id = p_student_id AND status = 'active';
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'status', 'rejected', 'message', 'No active device bound for student');
    END IF;

    -- 4. Verify Biometric Confirmation
    IF NOT p_biometric_success THEN
        UPDATE public.checkin_attempts 
        SET status = 'auth_failed', outcome_reason = 'Native biometric verification failed or cancelled' 
        WHERE id = p_attempt_id;
        RETURN jsonb_build_object('success', false, 'status', 'auth_failed', 'message', 'Biometric authentication not completed');
    END IF;

    -- 5. Retrieve Session & Location Anchor
    SELECT s.*, l.latitude, l.longitude, l.radius_metres 
    INTO v_session 
    FROM public.attendance_sessions s
    JOIN public.classroom_locations l ON s.classroom_location_id = l.id
    WHERE s.id = v_attempt.session_id;

    IF NOT FOUND OR v_session.state <> 'active' THEN
        RETURN jsonb_build_object('success', false, 'status', 'rejected', 'message', 'Session is not currently active');
    END IF;

    -- 6. Calculate Distance and Verify Geofence
    v_distance := calculate_distance_metres(p_latitude, p_longitude, v_session.latitude, v_session.longitude);

    IF v_distance > v_session.radius_metres THEN
        UPDATE public.checkin_attempts 
        SET status = 'location_failed', distance_metres = v_distance, outcome_reason = 'Location out of bounds' 
        WHERE id = p_attempt_id;
        RETURN jsonb_build_object('success', false, 'status', 'out_of_bounds', 'message', 'Location is outside approved classroom area', 'distance', v_distance);
    END IF;

    -- 7. Atomic Insert into Attendance Records (Guarded by Unique Constraint)
    INSERT INTO public.attendance_records (
        session_id, student_id, status, verification_method, verified_at
    ) VALUES (
        v_attempt.session_id, p_student_id, 'present', 'qr_biometric_geofence', v_now
    )
    ON CONFLICT (session_id, student_id) DO UPDATE 
    SET status = 'present', verified_at = v_now;

    -- 8. Finalize Attempt
    UPDATE public.checkin_attempts 
    SET status = 'confirmed', distance_metres = v_distance, committed_at = v_now 
    WHERE id = p_attempt_id;

    -- 9. Insert Audit Entry
    INSERT INTO public.audit_logs (actor_id, action, target_resource, details)
    VALUES (p_student_id, 'CHECKIN_COMMITTED', 'attendance_records', jsonb_build_object(
        'sessionId', v_attempt.session_id,
        'distance', v_distance,
        'accuracy', p_accuracy_metres
    ));

    RETURN jsonb_build_object('success', true, 'status', 'confirmed', 'message', 'Attendance confirmed present', 'verifiedAt', v_now);
END;
$$ LANGUAGE plpgsql;
