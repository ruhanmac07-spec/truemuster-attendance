-- TRUEMUSTER — Synthetic Baseline Seed Data
-- Database: PostgreSQL (Supabase)

-- 1. Profiles & Users
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

-- 2. Teachers
INSERT INTO public.teachers (id, employee_id, department) VALUES
    ('00000000-0000-0000-0000-000000000002', 'EMP-TURING-01', 'Computer Science & Engineering'),
    ('00000000-0000-0000-0000-000000000003', 'EMP-RAO-02', 'Computer Science & Engineering')
ON CONFLICT (id) DO NOTHING;

-- 3. Students
INSERT INTO public.students (id, enrollment_id, department, batch) VALUES
    ('00000000-0000-0000-0000-000000000011', '2023-CS-042', 'Computer Science & Engineering', '2023-2027'),
    ('00000000-0000-0000-0000-000000000012', '2023-CS-015', 'Computer Science & Engineering', '2023-2027'),
    ('00000000-0000-0000-0000-000000000013', '2023-CS-022', 'Computer Science & Engineering', '2023-2027'),
    ('00000000-0000-0000-0000-000000000014', '2023-CS-088', 'Computer Science & Engineering', '2023-2027'),
    ('00000000-0000-0000-0000-000000000015', '2023-CS-051', 'Computer Science & Engineering', '2023-2027')
ON CONFLICT (id) DO NOTHING;

-- 4. Classroom Locations (Lab 302, 100m geofence anchor)
INSERT INTO public.classroom_locations (id, room_number, building, latitude, longitude, radius_metres) VALUES
    ('10000000-0000-0000-0000-000000000302', 'Computing Lab 302', 'Turing Academic Block', 19.0760, 72.8777, 100.0)
ON CONFLICT (id) DO NOTHING;

-- 5. Course Sections
INSERT INTO public.course_sections (id, course_code, course_name, section, department, semester) VALUES
    ('20000000-0000-0000-0000-000000000401', 'CS401', 'Distributed Systems & Cloud Computing', 'Section A (Lab)', 'Computer Science & Engineering', 7),
    ('20000000-0000-0000-0000-000000000301', 'CS301', 'Operating Systems & Concurrency', 'Section B', 'Computer Science & Engineering', 5)
ON CONFLICT (id) DO NOTHING;

-- 6. Teacher Assignments
INSERT INTO public.teacher_assignments (teacher_id, course_section_id) VALUES
    ('00000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000301'),
    ('00000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000401')
ON CONFLICT (teacher_id, course_section_id) DO NOTHING;

-- 7. Registered Devices (Active device bindings)
INSERT INTO public.registered_devices (student_id, device_fingerprint, device_name, os_version, status) VALUES
    ('00000000-0000-0000-0000-000000000011', 'fp-pixel7-hw-alice-01', 'Google Pixel 7 (Hardware Keystore)', 'Android 14', 'active'),
    ('00000000-0000-0000-0000-000000000012', 'fp-samsung-s23-bob-02', 'Samsung Galaxy S23 (Knox TEE)', 'Android 14', 'active'),
    ('00000000-0000-0000-0000-000000000013', 'fp-oneplus-11-charlie-03', 'OnePlus 11 (TEE Keymaster)', 'Android 13', 'active')
ON CONFLICT DO NOTHING;

-- 8. Active Attendance Session
INSERT INTO public.attendance_sessions (id, course_section_id, teacher_id, classroom_location_id, scheduled_start, scheduled_end, state) VALUES
    ('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000401', '00000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000302', NOW() - INTERVAL '15 minutes', NOW() + INTERVAL '45 minutes', 'active')
ON CONFLICT (id) DO NOTHING;
