/*
  # Populate Healthcare Database with Sample Data

  1. Sample Users
    - Creates sample profiles for different roles (admin, doctor, nurse, patient)
    - Includes realistic healthcare professional data
    
  2. Sample Medical Data
    - Appointments between doctors and patients
    - Medical records with test results
    - Room bookings and availability
    
  3. Sample Operational Data
    - Payment records
    - Messages between users
    - Nurse requests for home care
    
  4. Sample System Data
    - Audit logs for system activity
    - Room inventory with different types
*/

-- Insert sample rooms first
INSERT INTO rooms (room_number, room_type, floor, capacity, daily_rate, equipment, status, description) VALUES
('101A', 'Standard', 1, 1, 150.00, ARRAY['Bed', 'TV', 'Private Bathroom'], 'available', 'Standard single occupancy room'),
('101B', 'Standard', 1, 1, 150.00, ARRAY['Bed', 'TV', 'Private Bathroom'], 'occupied', 'Standard single occupancy room'),
('102A', 'Deluxe', 1, 1, 250.00, ARRAY['Bed', 'TV', 'Private Bathroom', 'Refrigerator', 'Sofa'], 'available', 'Deluxe single room with amenities'),
('201A', 'ICU', 2, 1, 500.00, ARRAY['ICU Bed', 'Ventilator', 'Heart Monitor', 'IV Stand'], 'available', 'Intensive Care Unit'),
('201B', 'ICU', 2, 1, 500.00, ARRAY['ICU Bed', 'Ventilator', 'Heart Monitor', 'IV Stand'], 'maintenance', 'Intensive Care Unit - Under maintenance'),
('301A', 'Suite', 3, 2, 400.00, ARRAY['King Bed', 'Sofa Bed', 'TV', 'Kitchenette', 'Private Bathroom'], 'available', 'Executive suite for extended stays'),
('302A', 'Maternity', 3, 1, 300.00, ARRAY['Adjustable Bed', 'Baby Crib', 'TV', 'Private Bathroom'], 'available', 'Maternity ward room'),
('401A', 'Pediatric', 4, 1, 200.00, ARRAY['Pediatric Bed', 'TV', 'Play Area', 'Private Bathroom'], 'available', 'Child-friendly room'),
('401B', 'Pediatric', 4, 1, 200.00, ARRAY['Pediatric Bed', 'TV', 'Play Area', 'Private Bathroom'], 'reserved', 'Child-friendly room'),
('501A', 'Emergency', 5, 1, 350.00, ARRAY['Emergency Bed', 'Defibrillator', 'Oxygen Supply', 'Emergency Equipment'], 'available', 'Emergency department room');

-- Insert sample profiles (these will be linked to auth.users when users register)
-- Note: In a real scenario, these would be created through the registration process
-- For demo purposes, we'll create profiles with placeholder UUIDs that can be updated

-- Sample Admin
INSERT INTO profiles (id, email, full_name, role, phone, department, is_active) VALUES
('00000000-0000-0000-0000-000000000001', 'admin@healthcareportal.com', 'System Administrator', 'admin', '+1-555-0001', 'Administration', true);

-- Sample Doctors
INSERT INTO profiles (id, email, full_name, role, phone, department, license_number, specialization, experience_years, is_active) VALUES
('00000000-0000-0000-0000-000000000002', 'dr.johnson@healthcareportal.com', 'Dr. Sarah Johnson', 'doctor', '+1-555-0002', 'Cardiology', 'MD123456', 'Cardiologist', 15, true),
('00000000-0000-0000-0000-000000000003', 'dr.chen@healthcareportal.com', 'Dr. Michael Chen', 'doctor', '+1-555-0003', 'Neurology', 'MD123457', 'Neurologist', 12, true),
('00000000-0000-0000-0000-000000000004', 'dr.williams@healthcareportal.com', 'Dr. Emily Williams', 'doctor', '+1-555-0004', 'Pediatrics', 'MD123458', 'Pediatrician', 10, true),
('00000000-0000-0000-0000-000000000005', 'dr.martinez@healthcareportal.com', 'Dr. Robert Martinez', 'doctor', '+1-555-0005', 'General Medicine', 'MD123459', 'General Physician', 14, true);

-- Sample Nurses
INSERT INTO profiles (id, email, full_name, role, phone, department, license_number, specialization, experience_years, is_active) VALUES
('00000000-0000-0000-0000-000000000006', 'nurse.davis@healthcareportal.com', 'Nurse Jennifer Davis', 'nurse', '+1-555-0006', 'ICU', 'RN123456', 'Critical Care', 8, true),
('00000000-0000-0000-0000-000000000007', 'nurse.wilson@healthcareportal.com', 'Nurse David Wilson', 'nurse', '+1-555-0007', 'Emergency', 'RN123457', 'Emergency Care', 6, true),
('00000000-0000-0000-0000-000000000008', 'nurse.brown@healthcareportal.com', 'Nurse Lisa Brown', 'nurse', '+1-555-0008', 'Pediatrics', 'RN123458', 'Pediatric Care', 5, true);

-- Sample Patients
INSERT INTO profiles (id, email, full_name, role, phone, date_of_birth, address, emergency_contact, emergency_phone, is_active) VALUES
('00000000-0000-0000-0000-000000000009', 'john.smith@email.com', 'John Smith', 'patient', '+1-555-0009', '1980-05-15', '123 Main St, Anytown, ST 12345', 'Jane Smith', '+1-555-0010', true),
('00000000-0000-0000-0000-000000000010', 'mary.johnson@email.com', 'Mary Johnson', 'patient', '+1-555-0011', '1975-08-22', '456 Oak Ave, Somewhere, ST 12346', 'Bob Johnson', '+1-555-0012', true),
('00000000-0000-0000-0000-000000000011', 'james.wilson@email.com', 'James Wilson', 'patient', '+1-555-0013', '1990-12-03', '789 Pine Rd, Elsewhere, ST 12347', 'Sarah Wilson', '+1-555-0014', true),
('00000000-0000-0000-0000-000000000012', 'susan.davis@email.com', 'Susan Davis', 'patient', '+1-555-0015', '1985-03-18', '321 Elm St, Nowhere, ST 12348', 'Mike Davis', '+1-555-0016', true),
('00000000-0000-0000-0000-000000000013', 'robert.brown@email.com', 'Robert Brown', 'patient', '+1-555-0017', '1970-11-30', '654 Maple Dr, Anyplace, ST 12349', 'Linda Brown', '+1-555-0018', true);

-- Sample Appointments
INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, duration_minutes, appointment_type, status, notes) VALUES
('00000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000002', '2024-01-20', '09:00:00', 30, 'Consultation', 'confirmed', 'Regular checkup for heart condition'),
('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000003', '2024-01-20', '10:30:00', 45, 'Follow-up', 'confirmed', 'Neurological assessment follow-up'),
('00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000004', '2024-01-21', '14:00:00', 30, 'Vaccination', 'pending', 'Annual vaccination for child'),
('00000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000005', '2024-01-22', '11:00:00', 30, 'Consultation', 'confirmed', 'General health checkup'),
('00000000-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000002', '2024-01-23', '15:30:00', 30, 'Follow-up', 'pending', 'Post-surgery cardiac follow-up');

-- Sample Medical Records
INSERT INTO medical_records (patient_id, doctor_id, record_type, title, description, test_results, record_date, is_critical) VALUES
('00000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000002', 'Lab Results', 'Cardiac Enzyme Test', 'Routine cardiac enzyme levels check', '{"troponin": "0.02 ng/mL", "CK-MB": "2.5 ng/mL", "cholesterol": "180 mg/dL"}', '2024-01-15', false),
('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000003', 'Imaging', 'Brain MRI', 'MRI scan for headache evaluation', '{"findings": "No abnormalities detected", "contrast": "Used", "quality": "Excellent"}', '2024-01-10', false),
('00000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000005', 'Physical Exam', 'Annual Physical', 'Comprehensive annual physical examination', '{"blood_pressure": "120/80", "weight": "70kg", "height": "175cm", "bmi": "22.9"}', '2024-01-12', false),
('00000000-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000002', 'Surgery Report', 'Cardiac Bypass Surgery', 'Triple bypass surgery completed successfully', '{"procedure": "CABG x3", "duration": "4 hours", "complications": "None", "recovery": "Normal"}', '2024-01-08', true);

-- Sample Room Bookings
INSERT INTO room_bookings (patient_id, room_id, check_in_date, check_out_date, total_cost, status, special_requirements) VALUES
('00000000-0000-0000-0000-000000000013', (SELECT id FROM rooms WHERE room_number = '201A'), '2024-01-08', '2024-01-12', 2000.00, 'completed', 'Post-surgery monitoring required'),
('00000000-0000-0000-0000-000000000009', (SELECT id FROM rooms WHERE room_number = '102A'), '2024-01-25', '2024-01-27', 500.00, 'confirmed', 'Cardiac monitoring equipment needed'),
('00000000-0000-0000-0000-000000000011', (SELECT id FROM rooms WHERE room_number = '401A'), '2024-01-30', '2024-02-01', 400.00, 'pending', 'Child-friendly environment');

-- Sample Payments
INSERT INTO payments (patient_id, appointment_id, room_booking_id, amount, description, payment_method, status, due_date) VALUES
('00000000-0000-0000-0000-000000000009', (SELECT id FROM appointments WHERE patient_id = '00000000-0000-0000-0000-000000000009' LIMIT 1), NULL, 150.00, 'Cardiology Consultation', 'Credit Card', 'paid', '2024-01-20'),
('00000000-0000-0000-0000-000000000010', (SELECT id FROM appointments WHERE patient_id = '00000000-0000-0000-0000-000000000010' LIMIT 1), NULL, 200.00, 'Neurology Follow-up', 'Insurance', 'paid', '2024-01-20'),
('00000000-0000-0000-0000-000000000013', NULL, (SELECT id FROM room_bookings WHERE patient_id = '00000000-0000-0000-0000-000000000013' LIMIT 1), 2000.00, 'ICU Room Charges', 'Insurance', 'paid', '2024-01-12'),
('00000000-0000-0000-0000-000000000012', (SELECT id FROM appointments WHERE patient_id = '00000000-0000-0000-0000-000000000012' LIMIT 1), NULL, 120.00, 'General Consultation', NULL, 'pending', '2024-01-30');

-- Sample Messages
INSERT INTO messages (sender_id, recipient_id, subject, content, priority, is_read) VALUES
('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000009', 'Appointment Reminder', 'This is a reminder for your upcoming appointment on January 20th at 9:00 AM. Please arrive 15 minutes early.', 'medium', false),
('00000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000002', 'Question about medication', 'Dr. Johnson, I have a question about the new medication you prescribed. Should I take it with food?', 'medium', true),
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'System Maintenance Notice', 'The patient portal will be undergoing maintenance this weekend from 2 AM to 6 AM on Saturday.', 'high', false),
('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000010', 'Test Results Available', 'Your MRI results are now available in your patient portal. Please review and contact us if you have any questions.', 'medium', false);

-- Sample Nurse Requests
INSERT INTO nurse_requests (patient_id, nurse_id, request_type, description, address, requested_date, requested_time, duration_hours, priority, status, services, special_instructions, estimated_cost) VALUES
('00000000-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000006', 'Post-Surgery Care', 'Post-operative care following cardiac surgery', '654 Maple Dr, Anyplace, ST 12349', '2024-01-15', '10:00:00', 4, 'high', 'completed', ARRAY['Wound Care', 'Medication Administration', 'Vital Signs Monitoring'], 'Patient requires careful monitoring of surgical site', 200.00),
('00000000-0000-0000-0000-000000000009', NULL, 'Routine Care', 'Regular health monitoring and medication assistance', '123 Main St, Anytown, ST 12345', '2024-01-25', '14:00:00', 2, 'medium', 'pending', ARRAY['Medication Administration', 'Health Assessment'], 'Patient has mobility issues', 100.00),
('00000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000007', 'Elderly Care', 'Assistance with daily activities and health monitoring', '321 Elm St, Nowhere, ST 12348', '2024-01-28', '09:00:00', 6, 'medium', 'in_progress', ARRAY['Personal Care', 'Medication Administration', 'Companionship'], 'Patient lives alone and needs assistance', 300.00);

-- Sample Audit Logs
INSERT INTO audit_logs (user_id, action, table_name, record_id, old_values, new_values, ip_address) VALUES
('00000000-0000-0000-0000-000000000001', 'INSERT', 'profiles', '00000000-0000-0000-0000-000000000009', NULL, '{"email": "john.smith@email.com", "role": "patient"}', '192.168.1.100'),
('00000000-0000-0000-0000-000000000002', 'UPDATE', 'appointments', (SELECT id FROM appointments LIMIT 1), '{"status": "pending"}', '{"status": "confirmed"}', '192.168.1.101'),
('00000000-0000-0000-0000-000000000006', 'UPDATE', 'nurse_requests', (SELECT id FROM nurse_requests LIMIT 1), '{"status": "pending"}', '{"status": "completed"}', '192.168.1.102');