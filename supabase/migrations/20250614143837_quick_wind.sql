/*
  # Add Mock Doctors Data
  
  1. Problem
    - Cannot insert profiles with UUIDs that don't exist in auth.users table
    - Foreign key constraint prevents direct profile insertion
    
  2. Solution
    - Create a function that safely adds mock doctor data
    - Use existing sample doctor profiles or create them properly
    - Add appointments and medical records for existing doctors
    - Create doctor statistics view
*/

-- First, let's add more sample appointments for existing doctors
DO $$
DECLARE
  existing_doctors uuid[];
  existing_patients uuid[];
  doctor_id uuid;
  patient_id uuid;
  i integer := 1;
BEGIN
  -- Get existing doctor IDs
  SELECT ARRAY(SELECT id FROM profiles WHERE role = 'doctor' AND is_active = true LIMIT 10) INTO existing_doctors;
  
  -- Get existing patient IDs  
  SELECT ARRAY(SELECT id FROM profiles WHERE role = 'patient' AND is_active = true LIMIT 5) INTO existing_patients;
  
  -- Only proceed if we have doctors and patients
  IF array_length(existing_doctors, 1) > 0 AND array_length(existing_patients, 1) > 0 THEN
    
    -- Create appointments for each doctor with different patients
    FOREACH doctor_id IN ARRAY existing_doctors LOOP
      -- Get a patient (cycle through available patients)
      patient_id := existing_patients[((i - 1) % array_length(existing_patients, 1)) + 1];
      
      -- Insert appointment
      INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, duration_minutes, appointment_type, status, notes)
      VALUES (
        patient_id,
        doctor_id,
        CURRENT_DATE + (i || ' days')::interval,
        ('09:00:00'::time + ((i * 30) % 480 || ' minutes')::interval), -- Spread throughout day
        CASE (i % 4)
          WHEN 0 THEN 30
          WHEN 1 THEN 45
          WHEN 2 THEN 60
          ELSE 30
        END,
        CASE (i % 5)
          WHEN 0 THEN 'Consultation'
          WHEN 1 THEN 'Follow-up'
          WHEN 2 THEN 'Check-up'
          WHEN 3 THEN 'Treatment'
          ELSE 'Emergency'
        END,
        CASE (i % 3)
          WHEN 0 THEN 'pending'::appointment_status
          WHEN 1 THEN 'confirmed'::appointment_status
          ELSE 'completed'::appointment_status
        END,
        'Sample appointment #' || i || ' for comprehensive testing'
      )
      ON CONFLICT DO NOTHING;
      
      i := i + 1;
    END LOOP;
    
  END IF;
END $$;

-- Add more medical records for existing doctors
DO $$
DECLARE
  existing_doctors uuid[];
  existing_patients uuid[];
  doctor_id uuid;
  patient_id uuid;
  i integer := 1;
BEGIN
  -- Get existing doctor IDs
  SELECT ARRAY(SELECT id FROM profiles WHERE role = 'doctor' AND is_active = true LIMIT 10) INTO existing_doctors;
  
  -- Get existing patient IDs
  SELECT ARRAY(SELECT id FROM profiles WHERE role = 'patient' AND is_active = true LIMIT 5) INTO existing_patients;
  
  -- Only proceed if we have doctors and patients
  IF array_length(existing_doctors, 1) > 0 AND array_length(existing_patients, 1) > 0 THEN
    
    -- Create medical records for each doctor
    FOREACH doctor_id IN ARRAY existing_doctors LOOP
      -- Get a patient (cycle through available patients)
      patient_id := existing_patients[((i - 1) % array_length(existing_patients, 1)) + 1];
      
      -- Insert medical record
      INSERT INTO medical_records (patient_id, doctor_id, record_type, title, description, test_results, record_date, is_critical)
      VALUES (
        patient_id,
        doctor_id,
        CASE (i % 6)
          WHEN 0 THEN 'Lab Results'
          WHEN 1 THEN 'Imaging'
          WHEN 2 THEN 'Physical Exam'
          WHEN 3 THEN 'Surgery Report'
          WHEN 4 THEN 'Consultation Notes'
          ELSE 'Treatment Plan'
        END,
        CASE (i % 6)
          WHEN 0 THEN 'Blood Work Analysis'
          WHEN 1 THEN 'X-Ray Results'
          WHEN 2 THEN 'Annual Physical Examination'
          WHEN 3 THEN 'Surgical Procedure Report'
          WHEN 4 THEN 'Specialist Consultation'
          ELSE 'Treatment Protocol'
        END,
        'Comprehensive medical record #' || i || ' documenting patient care and treatment progress.',
        CASE (i % 4)
          WHEN 0 THEN '{"blood_pressure": "120/80", "heart_rate": "72", "temperature": "98.6°F"}'::jsonb
          WHEN 1 THEN '{"findings": "Normal", "contrast_used": "Yes", "quality": "Excellent"}'::jsonb
          WHEN 2 THEN '{"weight": "70kg", "height": "175cm", "bmi": "22.9", "overall": "Healthy"}'::jsonb
          ELSE '{"procedure": "Successful", "duration": "2 hours", "complications": "None"}'::jsonb
        END,
        CURRENT_DATE - (i || ' days')::interval,
        CASE WHEN i % 10 = 0 THEN true ELSE false END -- 10% critical records
      )
      ON CONFLICT DO NOTHING;
      
      i := i + 1;
    END LOOP;
    
  END IF;
END $$;

-- Add more payments for existing appointments
DO $$
DECLARE
  appointment_record RECORD;
  i integer := 1;
BEGIN
  -- Create payments for appointments that don't have them
  FOR appointment_record IN 
    SELECT a.id, a.patient_id, a.appointment_type, a.doctor_id
    FROM appointments a
    LEFT JOIN payments p ON p.appointment_id = a.id
    WHERE p.id IS NULL
    LIMIT 20
  LOOP
    INSERT INTO payments (patient_id, appointment_id, amount, description, payment_method, status, due_date)
    VALUES (
      appointment_record.patient_id,
      appointment_record.id,
      CASE appointment_record.appointment_type
        WHEN 'Consultation' THEN 150.00
        WHEN 'Follow-up' THEN 100.00
        WHEN 'Check-up' THEN 120.00
        WHEN 'Treatment' THEN 200.00
        WHEN 'Emergency' THEN 300.00
        ELSE 150.00
      END,
      appointment_record.appointment_type || ' Fee',
      CASE (i % 4)
        WHEN 0 THEN 'Credit Card'
        WHEN 1 THEN 'Insurance'
        WHEN 2 THEN 'Cash'
        ELSE 'Debit Card'
      END,
      CASE (i % 3)
        WHEN 0 THEN 'paid'::payment_status
        WHEN 1 THEN 'pending'::payment_status
        ELSE 'paid'::payment_status
      END,
      CURRENT_DATE + (7 || ' days')::interval
    );
    
    i := i + 1;
  END LOOP;
END $$;

-- Add more nurse requests
DO $$
DECLARE
  existing_patients uuid[];
  existing_nurses uuid[];
  patient_id uuid;
  nurse_id uuid;
  i integer := 1;
BEGIN
  -- Get existing patient and nurse IDs
  SELECT ARRAY(SELECT id FROM profiles WHERE role = 'patient' AND is_active = true LIMIT 5) INTO existing_patients;
  SELECT ARRAY(SELECT id FROM profiles WHERE role = 'nurse' AND is_active = true LIMIT 3) INTO existing_nurses;
  
  -- Only proceed if we have patients and nurses
  IF array_length(existing_patients, 1) > 0 AND array_length(existing_nurses, 1) > 0 THEN
    
    -- Create nurse requests
    FOREACH patient_id IN ARRAY existing_patients LOOP
      -- Get a nurse (cycle through available nurses)
      nurse_id := existing_nurses[((i - 1) % array_length(existing_nurses, 1)) + 1];
      
      INSERT INTO nurse_requests (patient_id, nurse_id, request_type, description, address, requested_date, requested_time, duration_hours, priority, status, services, special_instructions, estimated_cost)
      VALUES (
        patient_id,
        CASE WHEN i % 3 = 0 THEN NULL ELSE nurse_id END, -- Some unassigned requests
        CASE (i % 4)
          WHEN 0 THEN 'Post-Surgery Care'
          WHEN 1 THEN 'Routine Care'
          WHEN 2 THEN 'Elderly Care'
          ELSE 'Medication Management'
        END,
        'Comprehensive nursing care request #' || i || ' for patient home care needs.',
        '123 Sample Street #' || i || ', Healthcare City, HC 12345',
        CURRENT_DATE + (i || ' days')::interval,
        ('08:00:00'::time + ((i * 60) % 600 || ' minutes')::interval),
        CASE (i % 3)
          WHEN 0 THEN 2
          WHEN 1 THEN 4
          ELSE 6
        END,
        CASE (i % 4)
          WHEN 0 THEN 'low'::priority_level
          WHEN 1 THEN 'medium'::priority_level
          WHEN 2 THEN 'high'::priority_level
          ELSE 'urgent'::priority_level
        END,
        CASE (i % 4)
          WHEN 0 THEN 'pending'::request_status
          WHEN 1 THEN 'confirmed'::request_status
          WHEN 2 THEN 'in_progress'::request_status
          ELSE 'completed'::request_status
        END,
        CASE (i % 3)
          WHEN 0 THEN ARRAY['Wound Care', 'Medication Administration']
          WHEN 1 THEN ARRAY['Vital Signs Monitoring', 'Health Assessment']
          ELSE ARRAY['Personal Care', 'Companionship', 'Medication Administration']
        END,
        'Special care instructions for request #' || i,
        (50 + (i * 25))::decimal(10,2)
      )
      ON CONFLICT DO NOTHING;
      
      i := i + 1;
    END LOOP;
    
  END IF;
END $$;

-- Add more messages between users
DO $$
DECLARE
  all_users uuid[];
  sender_id uuid;
  recipient_id uuid;
  i integer := 1;
BEGIN
  -- Get all user IDs
  SELECT ARRAY(SELECT id FROM profiles WHERE is_active = true LIMIT 15) INTO all_users;
  
  -- Only proceed if we have users
  IF array_length(all_users, 1) > 1 THEN
    
    -- Create messages between users
    FOR i IN 1..20 LOOP
      sender_id := all_users[((i - 1) % array_length(all_users, 1)) + 1];
      recipient_id := all_users[(i % array_length(all_users, 1)) + 1];
      
      -- Don't send message to self
      IF sender_id != recipient_id THEN
        INSERT INTO messages (sender_id, recipient_id, subject, content, priority, is_read)
        VALUES (
          sender_id,
          recipient_id,
          CASE (i % 8)
            WHEN 0 THEN 'Appointment Confirmation'
            WHEN 1 THEN 'Test Results Available'
            WHEN 2 THEN 'Prescription Renewal'
            WHEN 3 THEN 'Follow-up Required'
            WHEN 4 THEN 'Insurance Update'
            WHEN 5 THEN 'Schedule Change'
            WHEN 6 THEN 'Medical Question'
            ELSE 'General Inquiry'
          END,
          'This is a sample message #' || i || ' for testing the messaging system. ' ||
          'It contains important healthcare communication between users.',
          CASE (i % 3)
            WHEN 0 THEN 'low'::priority_level
            WHEN 1 THEN 'medium'::priority_level
            ELSE 'high'::priority_level
          END,
          CASE WHEN i % 4 = 0 THEN true ELSE false END -- 25% read messages
        )
        ON CONFLICT DO NOTHING;
      END IF;
    END LOOP;
    
  END IF;
END $$;

-- Create a comprehensive view for doctor statistics
CREATE OR REPLACE VIEW doctor_stats AS
SELECT 
  p.id,
  p.full_name,
  p.email,
  p.phone,
  p.specialization,
  p.department,
  p.experience_years,
  p.license_number,
  p.created_at,
  COUNT(DISTINCT a.patient_id) as total_patients,
  COUNT(a.id) as total_appointments,
  COUNT(CASE WHEN a.status = 'completed' THEN 1 END) as completed_appointments,
  COUNT(CASE WHEN a.status = 'confirmed' THEN 1 END) as confirmed_appointments,
  COUNT(CASE WHEN a.status = 'pending' THEN 1 END) as pending_appointments,
  COUNT(CASE WHEN a.appointment_date >= CURRENT_DATE THEN 1 END) as upcoming_appointments,
  COUNT(CASE WHEN a.appointment_date = CURRENT_DATE THEN 1 END) as today_appointments,
  COUNT(DISTINCT mr.id) as medical_records_count,
  COALESCE(SUM(pay.amount), 0) as total_revenue,
  COUNT(DISTINCT pay.id) as total_payments,
  ROUND(AVG(CASE WHEN a.status = 'completed' THEN 1.0 ELSE 0.0 END) * 100, 2) as completion_rate
FROM profiles p
LEFT JOIN appointments a ON p.id = a.doctor_id
LEFT JOIN medical_records mr ON p.id = mr.doctor_id
LEFT JOIN payments pay ON a.id = pay.appointment_id
WHERE p.role = 'doctor' AND p.is_active = true
GROUP BY p.id, p.full_name, p.email, p.phone, p.specialization, p.department, p.experience_years, p.license_number, p.created_at
ORDER BY p.full_name;

-- Create a view for patient statistics
CREATE OR REPLACE VIEW patient_stats AS
SELECT 
  p.id,
  p.full_name,
  p.email,
  p.phone,
  p.date_of_birth,
  p.address,
  p.emergency_contact,
  p.emergency_phone,
  p.created_at,
  COUNT(DISTINCT a.id) as total_appointments,
  COUNT(CASE WHEN a.status = 'completed' THEN 1 END) as completed_appointments,
  COUNT(CASE WHEN a.appointment_date >= CURRENT_DATE THEN 1 END) as upcoming_appointments,
  COUNT(DISTINCT mr.id) as medical_records_count,
  COUNT(DISTINCT rb.id) as room_bookings_count,
  COUNT(DISTINCT nr.id) as nurse_requests_count,
  COALESCE(SUM(pay.amount), 0) as total_payments,
  COUNT(CASE WHEN pay.status = 'pending' THEN 1 END) as pending_payments
FROM profiles p
LEFT JOIN appointments a ON p.id = a.patient_id
LEFT JOIN medical_records mr ON p.id = mr.patient_id
LEFT JOIN room_bookings rb ON p.id = rb.patient_id
LEFT JOIN nurse_requests nr ON p.id = nr.patient_id
LEFT JOIN payments pay ON p.id = pay.patient_id
WHERE p.role = 'patient' AND p.is_active = true
GROUP BY p.id, p.full_name, p.email, p.phone, p.date_of_birth, p.address, p.emergency_contact, p.emergency_phone, p.created_at
ORDER BY p.full_name;

-- Create a view for system overview
CREATE OR REPLACE VIEW system_overview AS
SELECT 
  (SELECT COUNT(*) FROM profiles WHERE role = 'patient' AND is_active = true) as total_patients,
  (SELECT COUNT(*) FROM profiles WHERE role = 'doctor' AND is_active = true) as total_doctors,
  (SELECT COUNT(*) FROM profiles WHERE role = 'nurse' AND is_active = true) as total_nurses,
  (SELECT COUNT(*) FROM profiles WHERE role = 'admin' AND is_active = true) as total_admins,
  (SELECT COUNT(*) FROM appointments) as total_appointments,
  (SELECT COUNT(*) FROM appointments WHERE appointment_date = CURRENT_DATE) as today_appointments,
  (SELECT COUNT(*) FROM appointments WHERE status = 'pending') as pending_appointments,
  (SELECT COUNT(*) FROM medical_records) as total_medical_records,
  (SELECT COUNT(*) FROM room_bookings) as total_room_bookings,
  (SELECT COUNT(*) FROM rooms WHERE status = 'available') as available_rooms,
  (SELECT COUNT(*) FROM nurse_requests) as total_nurse_requests,
  (SELECT COUNT(*) FROM nurse_requests WHERE status = 'pending') as pending_nurse_requests,
  (SELECT COALESCE(SUM(amount), 0) FROM payments WHERE status = 'paid') as total_revenue,
  (SELECT COUNT(*) FROM payments WHERE status = 'pending') as pending_payments,
  (SELECT COUNT(*) FROM messages WHERE is_read = false) as unread_messages;

-- Add helpful comments
COMMENT ON VIEW doctor_stats IS 'Comprehensive statistics for doctors including appointments, patients, and revenue';
COMMENT ON VIEW patient_stats IS 'Patient statistics including appointments, medical records, and payments';
COMMENT ON VIEW system_overview IS 'High-level system statistics for dashboard overview';

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_date ON appointments(doctor_id, appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_patient_date ON appointments(patient_id, appointment_date);
CREATE INDEX IF NOT EXISTS idx_medical_records_patient ON medical_records(patient_id, record_date);
CREATE INDEX IF NOT EXISTS idx_medical_records_doctor ON medical_records(doctor_id, record_date);
CREATE INDEX IF NOT EXISTS idx_payments_patient ON payments(patient_id, created_at);
CREATE INDEX IF NOT EXISTS idx_messages_recipient ON messages(recipient_id, is_read);
CREATE INDEX IF NOT EXISTS idx_profiles_role_active ON profiles(role, is_active);

-- Add some audit log entries for the new data
INSERT INTO audit_logs (user_id, action, table_name, old_values, new_values, ip_address)
SELECT 
  p.id,
  'BULK_INSERT',
  'sample_data',
  NULL,
  '{"action": "Added comprehensive sample data for testing", "timestamp": "' || NOW() || '"}'::jsonb,
  '127.0.0.1'::inet
FROM profiles p 
WHERE p.role = 'admin' 
LIMIT 1;