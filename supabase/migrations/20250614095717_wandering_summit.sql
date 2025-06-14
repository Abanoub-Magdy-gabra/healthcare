/*
  # Populate Healthcare Database with Sample Data
  
  1. Sample Data Creation
    - Hospital rooms with different types and equipment
    - Healthcare professionals (doctors, nurses, admin)
    - Patient profiles with contact information
    - Appointments between patients and doctors
    - Medical records with test results
    - Room bookings and payments
    - Messages and nurse requests
    - Audit logs for system tracking
  
  2. Data Integrity
    - Uses ON CONFLICT clauses to prevent duplicates
    - Maintains referential integrity between tables
    - Creates realistic healthcare scenarios
*/

-- Insert sample rooms (only if they don't exist)
INSERT INTO rooms (room_number, room_type, floor, capacity, daily_rate, equipment, status, description) 
VALUES
('101A', 'Standard', 1, 1, 150.00, ARRAY['Bed', 'TV', 'Private Bathroom'], 'available', 'Standard single occupancy room'),
('101B', 'Standard', 1, 1, 150.00, ARRAY['Bed', 'TV', 'Private Bathroom'], 'occupied', 'Standard single occupancy room'),
('102A', 'Deluxe', 1, 1, 250.00, ARRAY['Bed', 'TV', 'Private Bathroom', 'Refrigerator', 'Sofa'], 'available', 'Deluxe single room with amenities'),
('201A', 'ICU', 2, 1, 500.00, ARRAY['ICU Bed', 'Ventilator', 'Heart Monitor', 'IV Stand'], 'available', 'Intensive Care Unit'),
('201B', 'ICU', 2, 1, 500.00, ARRAY['ICU Bed', 'Ventilator', 'Heart Monitor', 'IV Stand'], 'maintenance', 'Intensive Care Unit - Under maintenance'),
('301A', 'Suite', 3, 2, 400.00, ARRAY['King Bed', 'Sofa Bed', 'TV', 'Kitchenette', 'Private Bathroom'], 'available', 'Executive suite for extended stays'),
('302A', 'Maternity', 3, 1, 300.00, ARRAY['Adjustable Bed', 'Baby Crib', 'TV', 'Private Bathroom'], 'available', 'Maternity ward room'),
('401A', 'Pediatric', 4, 1, 200.00, ARRAY['Pediatric Bed', 'TV', 'Play Area', 'Private Bathroom'], 'available', 'Child-friendly room'),
('401B', 'Pediatric', 4, 1, 200.00, ARRAY['Pediatric Bed', 'TV', 'Play Area', 'Private Bathroom'], 'reserved', 'Child-friendly room'),
('501A', 'Emergency', 5, 1, 350.00, ARRAY['Emergency Bed', 'Defibrillator', 'Oxygen Supply', 'Emergency Equipment'], 'available', 'Emergency department room')
ON CONFLICT (room_number) DO NOTHING;

-- Insert sample profiles (only if they don't exist)
-- Note: These use placeholder UUIDs and will be linked to auth.users when users register

-- Sample Admin
INSERT INTO profiles (id, email, full_name, role, phone, department, is_active) 
VALUES ('00000000-0000-0000-0000-000000000001', 'admin@healthcareportal.com', 'System Administrator', 'admin', '+1-555-0001', 'Administration', true)
ON CONFLICT (email) DO NOTHING;

-- Sample Doctors
INSERT INTO profiles (id, email, full_name, role, phone, department, license_number, specialization, experience_years, is_active) 
VALUES
('00000000-0000-0000-0000-000000000002', 'dr.johnson@healthcareportal.com', 'Dr. Sarah Johnson', 'doctor', '+1-555-0002', 'Cardiology', 'MD123456', 'Cardiologist', 15, true),
('00000000-0000-0000-0000-000000000003', 'dr.chen@healthcareportal.com', 'Dr. Michael Chen', 'doctor', '+1-555-0003', 'Neurology', 'MD123457', 'Neurologist', 12, true),
('00000000-0000-0000-0000-000000000004', 'dr.williams@healthcareportal.com', 'Dr. Emily Williams', 'doctor', '+1-555-0004', 'Pediatrics', 'MD123458', 'Pediatrician', 10, true),
('00000000-0000-0000-0000-000000000005', 'dr.martinez@healthcareportal.com', 'Dr. Robert Martinez', 'doctor', '+1-555-0005', 'General Medicine', 'MD123459', 'General Physician', 14, true)
ON CONFLICT (email) DO NOTHING;

-- Sample Nurses
INSERT INTO profiles (id, email, full_name, role, phone, department, license_number, specialization, experience_years, is_active) 
VALUES
('00000000-0000-0000-0000-000000000006', 'nurse.davis@healthcareportal.com', 'Nurse Jennifer Davis', 'nurse', '+1-555-0006', 'ICU', 'RN123456', 'Critical Care', 8, true),
('00000000-0000-0000-0000-000000000007', 'nurse.wilson@healthcareportal.com', 'Nurse David Wilson', 'nurse', '+1-555-0007', 'Emergency', 'RN123457', 'Emergency Care', 6, true),
('00000000-0000-0000-0000-000000000008', 'nurse.brown@healthcareportal.com', 'Nurse Lisa Brown', 'nurse', '+1-555-0008', 'Pediatrics', 'RN123458', 'Pediatric Care', 5, true)
ON CONFLICT (email) DO NOTHING;

-- Sample Patients
INSERT INTO profiles (id, email, full_name, role, phone, date_of_birth, address, emergency_contact, emergency_phone, is_active) 
VALUES
('00000000-0000-0000-0000-000000000009', 'john.smith@email.com', 'John Smith', 'patient', '+1-555-0009', '1980-05-15', '123 Main St, Anytown, ST 12345', 'Jane Smith', '+1-555-0010', true),
('00000000-0000-0000-0000-000000000010', 'mary.johnson@email.com', 'Mary Johnson', 'patient', '+1-555-0011', '1975-08-22', '456 Oak Ave, Somewhere, ST 12346', 'Bob Johnson', '+1-555-0012', true),
('00000000-0000-0000-0000-000000000011', 'james.wilson@email.com', 'James Wilson', 'patient', '+1-555-0013', '1990-12-03', '789 Pine Rd, Elsewhere, ST 12347', 'Sarah Wilson', '+1-555-0014', true),
('00000000-0000-0000-0000-000000000012', 'susan.davis@email.com', 'Susan Davis', 'patient', '+1-555-0015', '1985-03-18', '321 Elm St, Nowhere, ST 12348', 'Mike Davis', '+1-555-0016', true),
('00000000-0000-0000-0000-000000000013', 'robert.brown@email.com', 'Robert Brown', 'patient', '+1-555-0017', '1970-11-30', '654 Maple Dr, Anyplace, ST 12349', 'Linda Brown', '+1-555-0018', true)
ON CONFLICT (email) DO NOTHING;

-- Insert sample appointments (only if profiles exist)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM profiles WHERE email = 'john.smith@email.com') AND 
     EXISTS (SELECT 1 FROM profiles WHERE email = 'dr.johnson@healthcareportal.com') THEN
    
    INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, duration_minutes, appointment_type, status, notes) 
    SELECT 
      p1.id as patient_id,
      p2.id as doctor_id,
      appointment_date,
      appointment_time,
      duration_minutes,
      appointment_type,
      status,
      notes
    FROM (VALUES
      ('john.smith@email.com', 'dr.johnson@healthcareportal.com', '2024-01-20'::date, '09:00:00'::time, 30, 'Consultation', 'confirmed', 'Regular checkup for heart condition'),
      ('mary.johnson@email.com', 'dr.chen@healthcareportal.com', '2024-01-20'::date, '10:30:00'::time, 45, 'Follow-up', 'confirmed', 'Neurological assessment follow-up'),
      ('james.wilson@email.com', 'dr.williams@healthcareportal.com', '2024-01-21'::date, '14:00:00'::time, 30, 'Vaccination', 'pending', 'Annual vaccination for child'),
      ('susan.davis@email.com', 'dr.martinez@healthcareportal.com', '2024-01-22'::date, '11:00:00'::time, 30, 'Consultation', 'confirmed', 'General health checkup'),
      ('robert.brown@email.com', 'dr.johnson@healthcareportal.com', '2024-01-23'::date, '15:30:00'::time, 30, 'Follow-up', 'pending', 'Post-surgery cardiac follow-up')
    ) AS v(patient_email, doctor_email, appointment_date, appointment_time, duration_minutes, appointment_type, status, notes)
    JOIN profiles p1 ON p1.email = v.patient_email
    JOIN profiles p2 ON p2.email = v.doctor_email
    WHERE NOT EXISTS (
      SELECT 1 FROM appointments a 
      WHERE a.patient_id = p1.id 
      AND a.doctor_id = p2.id 
      AND a.appointment_date = v.appointment_date 
      AND a.appointment_time = v.appointment_time
    );
  END IF;
END $$;

-- Insert sample medical records (only if profiles exist)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM profiles WHERE email = 'john.smith@email.com') THEN
    
    INSERT INTO medical_records (patient_id, doctor_id, record_type, title, description, test_results, record_date, is_critical) 
    SELECT 
      p1.id as patient_id,
      p2.id as doctor_id,
      record_type,
      title,
      description,
      test_results::jsonb,
      record_date,
      is_critical
    FROM (VALUES
      ('john.smith@email.com', 'dr.johnson@healthcareportal.com', 'Lab Results', 'Cardiac Enzyme Test', 'Routine cardiac enzyme levels check', '{"troponin": "0.02 ng/mL", "CK-MB": "2.5 ng/mL", "cholesterol": "180 mg/dL"}', '2024-01-15'::date, false),
      ('mary.johnson@email.com', 'dr.chen@healthcareportal.com', 'Imaging', 'Brain MRI', 'MRI scan for headache evaluation', '{"findings": "No abnormalities detected", "contrast": "Used", "quality": "Excellent"}', '2024-01-10'::date, false),
      ('susan.davis@email.com', 'dr.martinez@healthcareportal.com', 'Physical Exam', 'Annual Physical', 'Comprehensive annual physical examination', '{"blood_pressure": "120/80", "weight": "70kg", "height": "175cm", "bmi": "22.9"}', '2024-01-12'::date, false),
      ('robert.brown@email.com', 'dr.johnson@healthcareportal.com', 'Surgery Report', 'Cardiac Bypass Surgery', 'Triple bypass surgery completed successfully', '{"procedure": "CABG x3", "duration": "4 hours", "complications": "None", "recovery": "Normal"}', '2024-01-08'::date, true)
    ) AS v(patient_email, doctor_email, record_type, title, description, test_results, record_date, is_critical)
    JOIN profiles p1 ON p1.email = v.patient_email
    JOIN profiles p2 ON p2.email = v.doctor_email
    WHERE NOT EXISTS (
      SELECT 1 FROM medical_records mr 
      WHERE mr.patient_id = p1.id 
      AND mr.doctor_id = p2.id 
      AND mr.title = v.title
    );
  END IF;
END $$;

-- Insert sample room bookings (only if profiles and rooms exist)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM profiles WHERE email = 'robert.brown@email.com') AND 
     EXISTS (SELECT 1 FROM rooms WHERE room_number = '201A') THEN
    
    INSERT INTO room_bookings (patient_id, room_id, check_in_date, check_out_date, total_cost, status, special_requirements) 
    SELECT 
      p.id as patient_id,
      r.id as room_id,
      check_in_date,
      check_out_date,
      total_cost,
      status::request_status,
      special_requirements
    FROM (VALUES
      ('robert.brown@email.com', '201A', '2024-01-08'::date, '2024-01-12'::date, 2000.00, 'completed', 'Post-surgery monitoring required'),
      ('john.smith@email.com', '102A', '2024-01-25'::date, '2024-01-27'::date, 500.00, 'confirmed', 'Cardiac monitoring equipment needed'),
      ('james.wilson@email.com', '401A', '2024-01-30'::date, '2024-02-01'::date, 400.00, 'pending', 'Child-friendly environment')
    ) AS v(patient_email, room_number, check_in_date, check_out_date, total_cost, status, special_requirements)
    JOIN profiles p ON p.email = v.patient_email
    JOIN rooms r ON r.room_number = v.room_number
    WHERE NOT EXISTS (
      SELECT 1 FROM room_bookings rb 
      WHERE rb.patient_id = p.id 
      AND rb.room_id = r.id 
      AND rb.check_in_date = v.check_in_date
    );
  END IF;
END $$;

-- Insert sample payments (only if related records exist)
DO $$
DECLARE
  appointment_id_1 uuid;
  appointment_id_2 uuid;
  appointment_id_3 uuid;
  booking_id_1 uuid;
BEGIN
  -- Get appointment IDs
  SELECT a.id INTO appointment_id_1 
  FROM appointments a 
  JOIN profiles p ON a.patient_id = p.id 
  WHERE p.email = 'john.smith@email.com' LIMIT 1;
  
  SELECT a.id INTO appointment_id_2 
  FROM appointments a 
  JOIN profiles p ON a.patient_id = p.id 
  WHERE p.email = 'mary.johnson@email.com' LIMIT 1;
  
  SELECT a.id INTO appointment_id_3 
  FROM appointments a 
  JOIN profiles p ON a.patient_id = p.id 
  WHERE p.email = 'susan.davis@email.com' LIMIT 1;
  
  -- Get booking ID
  SELECT rb.id INTO booking_id_1 
  FROM room_bookings rb 
  JOIN profiles p ON rb.patient_id = p.id 
  WHERE p.email = 'robert.brown@email.com' LIMIT 1;
  
  -- Insert payments if IDs exist
  IF appointment_id_1 IS NOT NULL THEN
    INSERT INTO payments (patient_id, appointment_id, amount, description, payment_method, status, due_date) 
    SELECT p.id, appointment_id_1, 150.00, 'Cardiology Consultation', 'Credit Card', 'paid'::payment_status, '2024-01-20'::date
    FROM profiles p 
    WHERE p.email = 'john.smith@email.com'
    AND NOT EXISTS (SELECT 1 FROM payments WHERE appointment_id = appointment_id_1);
  END IF;
  
  IF appointment_id_2 IS NOT NULL THEN
    INSERT INTO payments (patient_id, appointment_id, amount, description, payment_method, status, due_date) 
    SELECT p.id, appointment_id_2, 200.00, 'Neurology Follow-up', 'Insurance', 'paid'::payment_status, '2024-01-20'::date
    FROM profiles p 
    WHERE p.email = 'mary.johnson@email.com'
    AND NOT EXISTS (SELECT 1 FROM payments WHERE appointment_id = appointment_id_2);
  END IF;
  
  IF booking_id_1 IS NOT NULL THEN
    INSERT INTO payments (patient_id, room_booking_id, amount, description, payment_method, status, due_date) 
    SELECT p.id, booking_id_1, 2000.00, 'ICU Room Charges', 'Insurance', 'paid'::payment_status, '2024-01-12'::date
    FROM profiles p 
    WHERE p.email = 'robert.brown@email.com'
    AND NOT EXISTS (SELECT 1 FROM payments WHERE room_booking_id = booking_id_1);
  END IF;
  
  IF appointment_id_3 IS NOT NULL THEN
    INSERT INTO payments (patient_id, appointment_id, amount, description, status, due_date) 
    SELECT p.id, appointment_id_3, 120.00, 'General Consultation', 'pending'::payment_status, '2024-01-30'::date
    FROM profiles p 
    WHERE p.email = 'susan.davis@email.com'
    AND NOT EXISTS (SELECT 1 FROM payments WHERE appointment_id = appointment_id_3);
  END IF;
END $$;

-- Insert sample messages (only if profiles exist)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM profiles WHERE email = 'dr.johnson@healthcareportal.com') THEN
    
    INSERT INTO messages (sender_id, recipient_id, subject, content, priority, is_read) 
    SELECT 
      p1.id as sender_id,
      p2.id as recipient_id,
      subject,
      content,
      priority::priority_level,
      is_read
    FROM (VALUES
      ('dr.johnson@healthcareportal.com', 'john.smith@email.com', 'Appointment Reminder', 'This is a reminder for your upcoming appointment on January 20th at 9:00 AM. Please arrive 15 minutes early.', 'medium', false),
      ('john.smith@email.com', 'dr.johnson@healthcareportal.com', 'Question about medication', 'Dr. Johnson, I have a question about the new medication you prescribed. Should I take it with food?', 'medium', true),
      ('admin@healthcareportal.com', 'dr.johnson@healthcareportal.com', 'System Maintenance Notice', 'The patient portal will be undergoing maintenance this weekend from 2 AM to 6 AM on Saturday.', 'high', false),
      ('dr.chen@healthcareportal.com', 'mary.johnson@email.com', 'Test Results Available', 'Your MRI results are now available in your patient portal. Please review and contact us if you have any questions.', 'medium', false)
    ) AS v(sender_email, recipient_email, subject, content, priority, is_read)
    JOIN profiles p1 ON p1.email = v.sender_email
    JOIN profiles p2 ON p2.email = v.recipient_email
    WHERE NOT EXISTS (
      SELECT 1 FROM messages m 
      WHERE m.sender_id = p1.id 
      AND m.recipient_id = p2.id 
      AND m.subject = v.subject
    );
  END IF;
END $$;

-- Insert sample nurse requests (only if profiles exist)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM profiles WHERE email = 'robert.brown@email.com') THEN
    
    INSERT INTO nurse_requests (patient_id, nurse_id, request_type, description, address, requested_date, requested_time, duration_hours, priority, status, services, special_instructions, estimated_cost) 
    SELECT 
      p1.id as patient_id,
      p2.id as nurse_id,
      request_type,
      description,
      address,
      requested_date,
      requested_time,
      duration_hours,
      priority::priority_level,
      status::request_status,
      services,
      special_instructions,
      estimated_cost
    FROM (VALUES
      ('robert.brown@email.com', 'nurse.davis@healthcareportal.com', 'Post-Surgery Care', 'Post-operative care following cardiac surgery', '654 Maple Dr, Anyplace, ST 12349', '2024-01-15'::date, '10:00:00'::time, 4, 'high', 'completed', ARRAY['Wound Care', 'Medication Administration', 'Vital Signs Monitoring'], 'Patient requires careful monitoring of surgical site', 200.00),
      ('john.smith@email.com', NULL, 'Routine Care', 'Regular health monitoring and medication assistance', '123 Main St, Anytown, ST 12345', '2024-01-25'::date, '14:00:00'::time, 2, 'medium', 'pending', ARRAY['Medication Administration', 'Health Assessment'], 'Patient has mobility issues', 100.00),
      ('susan.davis@email.com', 'nurse.wilson@healthcareportal.com', 'Elderly Care', 'Assistance with daily activities and health monitoring', '321 Elm St, Nowhere, ST 12348', '2024-01-28'::date, '09:00:00'::time, 6, 'medium', 'in_progress', ARRAY['Personal Care', 'Medication Administration', 'Companionship'], 'Patient lives alone and needs assistance', 300.00)
    ) AS v(patient_email, nurse_email, request_type, description, address, requested_date, requested_time, duration_hours, priority, status, services, special_instructions, estimated_cost)
    JOIN profiles p1 ON p1.email = v.patient_email
    LEFT JOIN profiles p2 ON p2.email = v.nurse_email
    WHERE NOT EXISTS (
      SELECT 1 FROM nurse_requests nr 
      WHERE nr.patient_id = p1.id 
      AND nr.requested_date = v.requested_date 
      AND nr.requested_time = v.requested_time
    );
  END IF;
END $$;

-- Insert sample audit logs (only if profiles exist)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM profiles WHERE email = 'admin@healthcareportal.com') THEN
    
    INSERT INTO audit_logs (user_id, action, table_name, record_id, old_values, new_values, ip_address) 
    SELECT 
      p.id as user_id,
      action,
      table_name,
      record_id,
      old_values::jsonb,
      new_values::jsonb,
      ip_address::inet
    FROM (VALUES
      ('admin@healthcareportal.com', 'INSERT', 'profiles', '00000000-0000-0000-0000-000000000009', NULL, '{"email": "john.smith@email.com", "role": "patient"}', '192.168.1.100'),
      ('dr.johnson@healthcareportal.com', 'UPDATE', 'appointments', NULL, '{"status": "pending"}', '{"status": "confirmed"}', '192.168.1.101'),
      ('nurse.davis@healthcareportal.com', 'UPDATE', 'nurse_requests', NULL, '{"status": "pending"}', '{"status": "completed"}', '192.168.1.102')
    ) AS v(user_email, action, table_name, record_id, old_values, new_values, ip_address)
    JOIN profiles p ON p.email = v.user_email
    WHERE NOT EXISTS (
      SELECT 1 FROM audit_logs al 
      WHERE al.user_id = p.id 
      AND al.action = v.action 
      AND al.table_name = v.table_name
    );
  END IF;
END $$;