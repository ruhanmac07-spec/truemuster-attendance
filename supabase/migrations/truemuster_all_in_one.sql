-- ==============================================================================
-- TRUEMUSTER — Comprehensive All-in-One Database Migration & Seed Script
-- Database: PostgreSQL 15+ (Supabase)
-- Project: truemuster-dev (https://tqtsfdmmlaacsvzxbkil.supabase.co)
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 1. RELATIONAL SCHEMA DEFINITIONS
-- ==============================================================================

-- 1.1 User Profiles & Roles (Links to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('student', 'teacher', 'admin')),
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 1.2 Student Academic Records
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    enrollment_id TEXT NOT NULL UNIQUE,
    department TEXT NOT NULL,
    batch TEXT NOT NULL,
    active_device_id UUID,
    device_bound_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 1.3 Teacher Faculty Records
CREATE TABLE IF NOT EXISTS public.teachers (
    id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    employee_id TEXT NOT NULL UNIQUE,
    department TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 1.4 Classroom Locations & Physical Geofence Anchors
CREATE TABLE IF NOT EXISTS public.classroom_locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_number TEXT NOT NULL,
    building TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    radius_metres DOUBLE PRECISION NOT NULL DEFAULT 100.0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 1.5 Academic Courses and Sections
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

-- 1.6 Teacher Course Assignments
CREATE TABLE IF NOT EXISTS public.teacher_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID NOT NULL REFERENCES public.teachers(id) ON DELETE CASCADE,
    course_section_id UUID NOT NULL REFERENCES public.course_sections(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (teacher_id, course_section_id)
);

-- 1.7 Hardware-Bound Registered Devices (Strict 1-Device Policy)
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

-- Partial index guaranteeing at most ONE active device per student
CREATE UNIQUE INDEX IF NOT EXISTS idx_one_active_device_per_student 
ON public.registered_devices(student_id) 
WHERE status = 'active';

-- 1.8 Attendance Sessions (Live Lecture/Lab Window)
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

-- 1.9 Dynamic Rotating QR Challenges (Strict 90-Second Validity)
CREATE TABLE IF NOT EXISTS public.qr_challenges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES public.attendance_sessions(id) ON DELETE CASCADE,
    token TEXT NOT NULL UNIQUE,
    issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    is_consumed BOOLEAN NOT NULL DEFAULT FALSE
);

-- 1.10 Check-in Attempts (Strict 45-Second Committal Deadline)
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

-- 1.11 Authoritative Attendance Records (Immutable Single Source of Truth)
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

-- 1.12 Immutable Audit Logs
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID REFERENCES public.profiles(id),
    action TEXT NOT NULL,
    target_resource TEXT NOT NULL,
    details JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 2. ATOMIC PROCEDURES & HAVERSINE GEOFENCING
-- ==============================================================================

-- 2.1 Haversine Distance Calculation (Metres)
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

-- 2.2 Atomic Verification & Committal Procedure (SECURITY DEFINER)
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
    v_device RECORD;
    v_distance DOUBLE PRECISION;
    v_now TIMESTAMPTZ := NOW();
BEGIN
    -- 1. Retrieve and lock Attempt
    SELECT * INTO v_attempt FROM public.checkin_attempts WHERE id = p_attempt_id FOR UPDATE;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'status', 'rejected', 'message', 'Check-in attempt not found');
    END IF;

    IF v_attempt.student_id <> p_student_id THEN
        RETURN jsonb_build_object('success', false, 'status', 'rejected', 'message', 'Unauthorized attempt mismatch');
    END IF;

    -- 2. Verify 45-second committal deadline
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

    -- 5. Retrieve Session & Classroom Geofence Anchor
    SELECT s.*, l.latitude, l.longitude, l.radius_metres 
    INTO v_session 
    FROM public.attendance_sessions s
    JOIN public.classroom_locations l ON s.classroom_location_id = l.id
    WHERE s.id = v_attempt.session_id;

    IF NOT FOUND OR v_session.state <> 'active' THEN
        RETURN jsonb_build_object('success', false, 'status', 'rejected', 'message', 'Session is not currently active');
    END IF;

    -- 6. Calculate Distance and Verify Geofence (100m)
    v_distance := calculate_distance_metres(p_latitude, p_longitude, v_session.latitude, v_session.longitude);

    IF v_distance > v_session.radius_metres THEN
        UPDATE public.checkin_attempts 
        SET status = 'location_failed', distance_metres = v_distance, outcome_reason = 'Location out of bounds' 
        WHERE id = p_attempt_id;
        RETURN jsonb_build_object('success', false, 'status', 'out_of_bounds', 'message', 'Location is outside approved classroom area', 'distance', v_distance);
    END IF;

    -- 7. Atomic Committal into Attendance Records (Guarded by Unique Constraint)
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

    -- 9. Insert Audit Log
    INSERT INTO public.audit_logs (actor_id, action, target_resource, details)
    VALUES (p_student_id, 'CHECKIN_COMMITTED', 'attendance_records', jsonb_build_object(
        'sessionId', v_attempt.session_id,
        'distance', v_distance,
        'accuracy', p_accuracy_metres
    ));

    RETURN jsonb_build_object('success', true, 'status', 'confirmed', 'message', 'Attendance confirmed present', 'verifiedAt', v_now);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- 3. SUPABASE AUTH TRIGGER (AUTO-PROFILE CREATION)
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
        COALESCE(new.raw_user_meta_data->>'role', 'student')
    )
    ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email,
        full_name = EXCLUDED.full_name,
        role = EXCLUDED.role;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classroom_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registered_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qr_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checkin_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper to inspect role from profiles
CREATE OR REPLACE FUNCTION public.get_current_role()
RETURNS TEXT AS $$
    SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- 4.1 Profiles Policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Staff can view profiles" ON public.profiles;
CREATE POLICY "Staff can view profiles" ON public.profiles FOR SELECT USING (public.get_current_role() IN ('teacher', 'admin'));

-- 4.2 Classroom Locations & Course Sections (Read-only for all authenticated)
DROP POLICY IF EXISTS "Authenticated can read classroom locations" ON public.classroom_locations;
CREATE POLICY "Authenticated can read classroom locations" ON public.classroom_locations FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated can read course sections" ON public.course_sections;
CREATE POLICY "Authenticated can read course sections" ON public.course_sections FOR SELECT TO authenticated USING (true);

-- 4.3 Students Policies
DROP POLICY IF EXISTS "Student can view own record" ON public.students;
CREATE POLICY "Student can view own record" ON public.students FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Staff can view students" ON public.students;
CREATE POLICY "Staff can view students" ON public.students FOR SELECT USING (public.get_current_role() IN ('teacher', 'admin'));

-- 4.4 Registered Devices Policies
DROP POLICY IF EXISTS "Student can view own device" ON public.registered_devices;
CREATE POLICY "Student can view own device" ON public.registered_devices FOR SELECT USING (auth.uid() = student_id);

DROP POLICY IF EXISTS "Admin can view all devices" ON public.registered_devices;
CREATE POLICY "Admin can view all devices" ON public.registered_devices FOR ALL USING (public.get_current_role() = 'admin');

-- 4.5 Attendance Sessions Policies
DROP POLICY IF EXISTS "Authenticated users can view sessions" ON public.attendance_sessions;
CREATE POLICY "Authenticated users can view sessions" ON public.attendance_sessions FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Teachers can manage assigned sessions" ON public.attendance_sessions;
CREATE POLICY "Teachers can manage assigned sessions" ON public.attendance_sessions FOR ALL 
USING (
    public.get_current_role() = 'admin' OR 
    (public.get_current_role() = 'teacher' AND teacher_id = auth.uid())
);

-- 4.6 QR Challenges Policies
DROP POLICY IF EXISTS "Teachers can manage session challenges" ON public.qr_challenges;
CREATE POLICY "Teachers can manage session challenges" ON public.qr_challenges FOR ALL 
USING (
    public.get_current_role() = 'admin' OR 
    EXISTS (SELECT 1 FROM public.attendance_sessions s WHERE s.id = session_id AND s.teacher_id = auth.uid())
);

DROP POLICY IF EXISTS "Students can read active challenges" ON public.qr_challenges;
CREATE POLICY "Students can read active challenges" ON public.qr_challenges FOR SELECT TO authenticated USING (expires_at > NOW());

-- 4.7 Checkin Attempts Policies
DROP POLICY IF EXISTS "Students can manage own attempts" ON public.checkin_attempts;
CREATE POLICY "Students can manage own attempts" ON public.checkin_attempts FOR ALL USING (auth.uid() = student_id);

DROP POLICY IF EXISTS "Teachers can view session attempts" ON public.checkin_attempts;
CREATE POLICY "Teachers can view session attempts" ON public.checkin_attempts FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.attendance_sessions s WHERE s.id = session_id AND s.teacher_id = auth.uid()));

-- 4.8 Authoritative Attendance Records Policies
DROP POLICY IF EXISTS "Student can view own attendance records" ON public.attendance_records;
CREATE POLICY "Student can view own attendance records" ON public.attendance_records FOR SELECT USING (auth.uid() = student_id);

DROP POLICY IF EXISTS "Teachers can view session records" ON public.attendance_records;
CREATE POLICY "Teachers can view session records" ON public.attendance_records FOR SELECT 
USING (
    public.get_current_role() = 'admin' OR 
    EXISTS (SELECT 1 FROM public.attendance_sessions s WHERE s.id = session_id AND s.teacher_id = auth.uid())
);

DROP POLICY IF EXISTS "Teachers can adjust session records within 24h" ON public.attendance_records;
CREATE POLICY "Teachers can adjust session records within 24h" ON public.attendance_records FOR UPDATE 
USING (
    public.get_current_role() = 'admin' OR 
    (
        public.get_current_role() = 'teacher' AND 
        EXISTS (
            SELECT 1 FROM public.attendance_sessions s 
            WHERE s.id = session_id AND s.teacher_id = auth.uid() 
            AND s.scheduled_end >= NOW() - INTERVAL '24 hours'
        )
    )
);

-- Deny direct inserts to students; all commits must route through stored procedure
REVOKE INSERT, UPDATE, DELETE ON public.attendance_records FROM authenticated;
GRANT SELECT ON public.attendance_records TO authenticated;
GRANT EXECUTE ON FUNCTION public.verify_and_commit_attendance TO authenticated;

-- 4.9 Audit Logs Policies
DROP POLICY IF EXISTS "Admins can view audit logs" ON public.audit_logs;
CREATE POLICY "Admins can view audit logs" ON public.audit_logs FOR SELECT USING (public.get_current_role() = 'admin');
REVOKE UPDATE, DELETE ON public.audit_logs FROM authenticated;

-- ==============================================================================
-- 5. SYNTHETIC BASELINE FIXTURES (SEED DATA)
-- ==============================================================================

-- 5.1 Ensure Supabase Auth Users Exist for Synthetic Profiles
INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, role, aud)
VALUES 
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'admin.hamilton@institution.edu', '', NOW(), '{"full_name": "Dr. Margaret Hamilton", "role": "admin"}'::jsonb, 'authenticated', 'authenticated'),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000000', 'prof.turing@institution.edu', '', NOW(), '{"full_name": "Prof. Alan Turing", "role": "teacher"}'::jsonb, 'authenticated', 'authenticated'),
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000000', 'prof.rao@institution.edu', '', NOW(), '{"full_name": "Prof. K. Rao", "role": "teacher"}'::jsonb, 'authenticated', 'authenticated'),
  ('00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000000', 'alice.sharma@institution.edu', '', NOW(), '{"full_name": "Alice Sharma", "role": "student"}'::jsonb, 'authenticated', 'authenticated'),
  ('00000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000000', 'bob.jenkins@institution.edu', '', NOW(), '{"full_name": "Bob Jenkins", "role": "student"}'::jsonb, 'authenticated', 'authenticated'),
  ('00000000-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000000', 'charlie.dave@institution.edu', '', NOW(), '{"full_name": "Charlie Dave", "role": "student"}'::jsonb, 'authenticated', 'authenticated'),
  ('00000000-0000-0000-0000-000000000014', '00000000-0000-0000-0000-000000000000', 'divya.patel@institution.edu', '', NOW(), '{"full_name": "Divya Patel", "role": "student"}'::jsonb, 'authenticated', 'authenticated'),
  ('00000000-0000-0000-0000-000000000015', '00000000-0000-0000-0000-000000000000', 'ethan.hunt@institution.edu', '', NOW(), '{"full_name": "Ethan Hunt", "role": "student"}'::jsonb, 'authenticated', 'authenticated')
ON CONFLICT (id) DO NOTHING;

-- 5.2 Profiles
INSERT INTO public.profiles (id, email, full_name, role) VALUES
    ('00000000-0000-0000-0000-000000000001', 'admin.hamilton@institution.edu', 'Dr. Margaret Hamilton', 'admin'),
    ('00000000-0000-0000-0000-000000000002', 'prof.turing@institution.edu', 'Prof. Alan Turing', 'teacher'),
    ('00000000-0000-0000-0000-000000000003', 'prof.rao@institution.edu', 'Prof. K. Rao', 'teacher'),
    ('00000000-0000-0000-0000-000000000011', 'alice.sharma@institution.edu', 'Alice Sharma', 'student'),
    ('00000000-0000-0000-0000-000000000012', 'bob.jenkins@institution.edu', 'Bob Jenkins', 'student'),
    ('00000000-0000-0000-0000-000000000013', 'charlie.dave@institution.edu', 'Charlie Dave', 'student'),
    ('00000000-0000-0000-0000-000000000014', 'divya.patel@institution.edu', 'Divya Patel', 'student'),
    ('00000000-0000-0000-0000-000000000015', 'ethan.hunt@institution.edu', 'Ethan Hunt', 'student')
ON CONFLICT (id) DO NOTHING;

-- 5.3 Teachers
INSERT INTO public.teachers (id, employee_id, department) VALUES
    ('00000000-0000-0000-0000-000000000002', 'EMP-TURING-01', 'Computer Science & Engineering'),
    ('00000000-0000-0000-0000-000000000003', 'EMP-RAO-02', 'Computer Science & Engineering')
ON CONFLICT (id) DO NOTHING;

-- 5.4 Students
INSERT INTO public.students (id, enrollment_id, department, batch) VALUES
    ('00000000-0000-0000-0000-000000000011', '2023-CS-042', 'Computer Science & Engineering', '2023-2027'),
    ('00000000-0000-0000-0000-000000000012', '2023-CS-015', 'Computer Science & Engineering', '2023-2027'),
    ('00000000-0000-0000-0000-000000000013', '2023-CS-022', 'Computer Science & Engineering', '2023-2027'),
    ('00000000-0000-0000-0000-000000000014', '2023-CS-088', 'Computer Science & Engineering', '2023-2027'),
    ('00000000-0000-0000-0000-000000000015', '2023-CS-051', 'Computer Science & Engineering', '2023-2027')
ON CONFLICT (id) DO NOTHING;

-- 5.5 Classroom Locations (Lab 302, 100m geofence anchor)
INSERT INTO public.classroom_locations (id, room_number, building, latitude, longitude, radius_metres) VALUES
    ('10000000-0000-0000-0000-000000000302', 'Computing Lab 302', 'Turing Academic Block', 19.0760, 72.8777, 100.0)
ON CONFLICT (id) DO NOTHING;

-- 5.6 Course Sections
INSERT INTO public.course_sections (id, course_code, course_name, section, department, semester) VALUES
    ('20000000-0000-0000-0000-000000000401', 'CS401', 'Distributed Systems & Cloud Computing', 'Section A (Lab)', 'Computer Science & Engineering', 7),
    ('20000000-0000-0000-0000-000000000301', 'CS301', 'Operating Systems & Concurrency', 'Section B', 'Computer Science & Engineering', 5)
ON CONFLICT (id) DO NOTHING;

-- 5.7 Teacher Assignments
INSERT INTO public.teacher_assignments (teacher_id, course_section_id) VALUES
    ('00000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000301'),
    ('00000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000401')
ON CONFLICT (teacher_id, course_section_id) DO NOTHING;

-- 5.8 Registered Devices (Active device bindings)
INSERT INTO public.registered_devices (student_id, device_fingerprint, device_name, os_version, status) VALUES
    ('00000000-0000-0000-0000-000000000011', 'fp-pixel7-hw-alice-01', 'Google Pixel 7 (Hardware Keystore)', 'Android 14', 'active'),
    ('00000000-0000-0000-0000-000000000012', 'fp-samsung-s23-bob-02', 'Samsung Galaxy S23 (Knox TEE)', 'Android 14', 'active'),
    ('00000000-0000-0000-0000-000000000013', 'fp-oneplus-11-charlie-03', 'OnePlus 11 (TEE Keymaster)', 'Android 13', 'active')
ON CONFLICT DO NOTHING;

-- 5.9 Active Attendance Session
INSERT INTO public.attendance_sessions (id, course_section_id, teacher_id, classroom_location_id, scheduled_start, scheduled_end, state) VALUES
    ('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000401', '00000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000302', NOW() - INTERVAL '15 minutes', NOW() + INTERVAL '45 minutes', 'active')
ON CONFLICT (id) DO NOTHING;
