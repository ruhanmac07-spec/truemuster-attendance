-- TRUEMUSTER — Migration 002: Row Level Security (RLS) Policies & Authorization
-- Database: PostgreSQL (Supabase)

-- 1. Enable RLS on all sensitive tables
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

-- Helper function: get current authenticated user role
CREATE OR REPLACE FUNCTION public.get_current_role()
RETURNS TEXT AS $$
    SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- 2. Profiles Policies
-- Users can view their own profile
CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

-- Teachers and admins can view all profiles
CREATE POLICY "Staff can view profiles" 
ON public.profiles FOR SELECT 
USING (public.get_current_role() IN ('teacher', 'admin'));

-- 3. Students Policies
-- Student can view only their own student record
CREATE POLICY "Student can view own record" 
ON public.students FOR SELECT 
USING (auth.uid() = id);

-- Teachers and admins can view student records
CREATE POLICY "Staff can view students" 
ON public.students FOR SELECT 
USING (public.get_current_role() IN ('teacher', 'admin'));

-- 4. Registered Devices Policies
-- Student can view only their own device binding
CREATE POLICY "Student can view own device" 
ON public.registered_devices FOR SELECT 
USING (auth.uid() = student_id);

-- Admins can view and manage all devices
CREATE POLICY "Admin can view all devices" 
ON public.registered_devices FOR ALL 
USING (public.get_current_role() = 'admin');

-- 5. Attendance Sessions Policies
-- Anyone authenticated can view active/scheduled sessions
CREATE POLICY "Authenticated users can view sessions" 
ON public.attendance_sessions FOR SELECT 
TO authenticated 
USING (true);

-- Only assigned teachers or admins can create or update sessions
CREATE POLICY "Teachers can manage assigned sessions" 
ON public.attendance_sessions FOR ALL 
USING (
    public.get_current_role() = 'admin' OR 
    (public.get_current_role() = 'teacher' AND teacher_id = auth.uid())
);

-- 6. QR Challenges Policies
-- Teachers can view and insert challenges for their assigned sessions
CREATE POLICY "Teachers can manage session challenges" 
ON public.qr_challenges FOR ALL 
USING (
    public.get_current_role() = 'admin' OR 
    EXISTS (
        SELECT 1 FROM public.attendance_sessions s 
        WHERE s.id = session_id AND s.teacher_id = auth.uid()
    )
);

-- Authenticated students can read active challenges (to validate scanned tokens)
CREATE POLICY "Students can read active challenges" 
ON public.qr_challenges FOR SELECT 
TO authenticated 
USING (expires_at > NOW());

-- 7. Checkin Attempts Policies
-- Student can create and view their own attempts
CREATE POLICY "Students can manage own attempts" 
ON public.checkin_attempts FOR ALL 
USING (auth.uid() = student_id);

-- Teachers can view attempts for their sessions
CREATE POLICY "Teachers can view session attempts" 
ON public.checkin_attempts FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.attendance_sessions s 
        WHERE s.id = session_id AND s.teacher_id = auth.uid()
    )
);

-- 8. Authoritative Attendance Records Policies
-- CRITICAL POLICY: Students can ONLY SELECT their own attendance record
CREATE POLICY "Student can view own attendance records" 
ON public.attendance_records FOR SELECT 
USING (auth.uid() = student_id);

-- Teachers can view attendance records for their assigned sessions
CREATE POLICY "Teachers can view session records" 
ON public.attendance_records FOR SELECT 
USING (
    public.get_current_role() = 'admin' OR 
    EXISTS (
        SELECT 1 FROM public.attendance_sessions s 
        WHERE s.id = session_id AND s.teacher_id = auth.uid()
    )
);

-- Teachers can update records (within 24-hour teacher correction window)
CREATE POLICY "Teachers can adjust session records within 24h" 
ON public.attendance_records FOR UPDATE 
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

-- STUDENTS CAN NEVER INSERT OR UPDATE DIRECTLY (Inserts happen via SECURITY DEFINER procedure verify_and_commit_attendance)
REVOKE INSERT, UPDATE, DELETE ON public.attendance_records FROM authenticated;
GRANT SELECT ON public.attendance_records TO authenticated;
GRANT EXECUTE ON FUNCTION public.verify_and_commit_attendance TO authenticated;

-- 9. Audit Logs Policies
-- Only admins can view audit logs
CREATE POLICY "Admins can view audit logs" 
ON public.audit_logs FOR SELECT 
USING (public.get_current_role() = 'admin');

-- System procedures insert audit logs; direct updates/deletions are denied
REVOKE UPDATE, DELETE ON public.audit_logs FROM authenticated;
