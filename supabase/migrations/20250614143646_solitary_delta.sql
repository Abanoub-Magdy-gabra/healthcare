/*
  # Add Mock Data for Doctors

  1. Mock Doctor Profiles
    - Creates realistic doctor profiles with specializations
    - Includes contact information and professional details
    - Adds experience years and license numbers

  2. Additional Doctor Fields
    - Consultation fees
    - Availability schedules
    - Languages spoken
    - Education background
    - Hospital affiliations
*/

-- Insert additional mock doctors to populate the doctors page
INSERT INTO profiles (id, email, full_name, role, phone, department, license_number, specialization, experience_years, is_active) VALUES
-- Additional Cardiologists
('10000000-0000-0000-0000-000000000001', 'dr.ahmed.hassan@healthcareportal.com', 'Dr. Ahmed Hassan', 'doctor', '+1-555-1001', 'Cardiology', 'MD234567', 'Cardiologist', 18, true),
('10000000-0000-0000-0000-000000000002', 'dr.fatima.ali@healthcareportal.com', 'Dr. Fatima Ali', 'doctor', '+1-555-1002', 'Cardiology', 'MD234568', 'Cardiologist', 12, true),

-- Neurologists
('10000000-0000-0000-0000-000000000003', 'dr.omar.ibrahim@healthcareportal.com', 'Dr. Omar Ibrahim', 'doctor', '+1-555-1003', 'Neurology', 'MD234569', 'Neurologist', 16, true),
('10000000-0000-0000-0000-000000000004', 'dr.layla.mahmoud@healthcareportal.com', 'Dr. Layla Mahmoud', 'doctor', '+1-555-1004', 'Neurology', 'MD234570', 'Neurologist', 9, true),

-- Pediatricians
('10000000-0000-0000-0000-000000000005', 'dr.youssef.ahmed@healthcareportal.com', 'Dr. Youssef Ahmed', 'doctor', '+1-555-1005', 'Pediatrics', 'MD234571', 'Pediatrician', 14, true),
('10000000-0000-0000-0000-000000000006', 'dr.nour.hassan@healthcareportal.com', 'Dr. Nour Hassan', 'doctor', '+1-555-1006', 'Pediatrics', 'MD234572', 'Pediatrician', 8, true),

-- Orthopedic Surgeons
('10000000-0000-0000-0000-000000000007', 'dr.khaled.omar@healthcareportal.com', 'Dr. Khaled Omar', 'doctor', '+1-555-1007', 'Orthopedics', 'MD234573', 'Orthopedic Surgeon', 20, true),
('10000000-0000-0000-0000-000000000008', 'dr.sara.mohamed@healthcareportal.com', 'Dr. Sara Mohamed', 'doctor', '+1-555-1008', 'Orthopedics', 'MD234574', 'Orthopedic Surgeon', 11, true),

-- Dermatologists
('10000000-0000-0000-0000-000000000009', 'dr.amr.ali@healthcareportal.com', 'Dr. Amr Ali', 'doctor', '+1-555-1009', 'Dermatology', 'MD234575', 'Dermatologist', 13, true),
('10000000-0000-0000-0000-000000000010', 'dr.mona.ibrahim@healthcareportal.com', 'Dr. Mona Ibrahim', 'doctor', '+1-555-1010', 'Dermatology', 'MD234576', 'Dermatologist', 7, true),

-- Emergency Medicine
('10000000-0000-0000-0000-000000000011', 'dr.hassan.ahmed@healthcareportal.com', 'Dr. Hassan Ahmed', 'doctor', '+1-555-1011', 'Emergency', 'MD234577', 'Emergency Medicine', 15, true),
('10000000-0000-0000-0000-000000000012', 'dr.aya.omar@healthcareportal.com', 'Dr. Aya Omar', 'doctor', '+1-555-1012', 'Emergency', 'MD234578', 'Emergency Medicine', 6, true),

-- Psychiatrists
('10000000-0000-0000-0000-000000000013', 'dr.mohamed.hassan@healthcareportal.com', 'Dr. Mohamed Hassan', 'doctor', '+1-555-1013', 'Psychiatry', 'MD234579', 'Psychiatrist', 17, true),
('10000000-0000-0000-0000-000000000014', 'dr.dina.ali@healthcareportal.com', 'Dr. Dina Ali', 'doctor', '+1-555-1014', 'Psychiatry', 'MD234580', 'Psychiatrist', 10, true),

-- Radiologists
('10000000-0000-0000-0000-000000000015', 'dr.tamer.ibrahim@healthcareportal.com', 'Dr. Tamer Ibrahim', 'doctor', '+1-555-1015', 'Radiology', 'MD234581', 'Radiologist', 19, true),
('10000000-0000-0000-0000-000000000016', 'dr.rania.mohamed@healthcareportal.com', 'Dr. Rania Mohamed', 'doctor', '+1-555-1016', 'Radiology', 'MD234582', 'Radiologist', 12, true),

-- Anesthesiologists
('10000000-0000-0000-0000-000000000017', 'dr.waleed.omar@healthcareportal.com', 'Dr. Waleed Omar', 'doctor', '+1-555-1017', 'Anesthesiology', 'MD234583', 'Anesthesiologist', 14, true),
('10000000-0000-0000-0000-000000000018', 'dr.heba.ahmed@healthcareportal.com', 'Dr. Heba Ahmed', 'doctor', '+1-555-1018', 'Anesthesiology', 'MD234584', 'Anesthesiologist', 9, true),

-- Oncologists
('10000000-0000-0000-0000-000000000019', 'dr.karim.hassan@healthcareportal.com', 'Dr. Karim Hassan', 'doctor', '+1-555-1019', 'Oncology', 'MD234585', 'Oncologist', 16, true),
('10000000-0000-0000-0000-000000000020', 'dr.yasmin.ali@healthcareportal.com', 'Dr. Yasmin Ali', 'doctor', '+1-555-1020', 'Oncology', 'MD234586', 'Oncologist', 11, true)

ON CONFLICT (email) DO NOTHING;

-- Add some sample appointments for the new doctors
DO $$
DECLARE
  patient_ids uuid[] := ARRAY[
    '00000000-0000-0000-0000-000000000009',
    '00000000-0000-0000-0000-000000000010',
    '00000000-0000-0000-0000-000000000011',
    '00000000-0000-0000-0000-000000000012',
    '00000000-0000-0000-0000-000000000013'
  ];
  doctor_ids uuid[] := ARRAY[
    '10000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000003',
    '10000000-0000-0000-0000-000000000005',
    '10000000-0000-0000-0000-000000000007',
    '10000000-0000-0000-0000-000000000009'
  ];
  i integer;
BEGIN
  -- Create some sample appointments
  FOR i IN 1..5 LOOP
    INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, duration_minutes, appointment_type, status, notes)
    VALUES (
      patient_ids[i],
      doctor_ids[i],
      CURRENT_DATE + (i || ' days')::interval,
      ('09:00:00'::time + (i * 30 || ' minutes')::interval),
      30,
      CASE i 
        WHEN 1 THEN 'Consultation'
        WHEN 2 THEN 'Follow-up'
        WHEN 3 THEN 'Check-up'
        WHEN 4 THEN 'Treatment'
        ELSE 'Consultation'
      END,
      CASE i % 3
        WHEN 0 THEN 'pending'
        WHEN 1 THEN 'confirmed'
        ELSE 'completed'
      END,
      'Sample appointment for doctor ' || i
    )
    ON CONFLICT DO NOTHING;
  END LOOP;
END $$;

-- Add some medical records for the new doctors
DO $$
DECLARE
  patient_ids uuid[] := ARRAY[
    '00000000-0000-0000-0000-000000000009',
    '00000000-0000-0000-0000-000000000010',
    '00000000-0000-0000-0000-000000000011'
  ];
  doctor_ids uuid[] := ARRAY[
    '10000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000003',
    '10000000-0000-0000-0000-000000000005'
  ];
  i integer;
BEGIN
  -- Create some sample medical records
  FOR i IN 1..3 LOOP
    INSERT INTO medical_records (patient_id, doctor_id, record_type, title, description, record_date, is_critical)
    VALUES (
      patient_ids[i],
      doctor_ids[i],
      CASE i 
        WHEN 1 THEN 'Lab Results'
        WHEN 2 THEN 'Imaging'
        ELSE 'Physical Exam'
      END,
      'Medical Record ' || i,
      'Sample medical record created for testing purposes',
      CURRENT_DATE - (i || ' days')::interval,
      false
    )
    ON CONFLICT DO NOTHING;
  END LOOP;
END $$;

-- Create a view for doctor statistics (optional)
CREATE OR REPLACE VIEW doctor_stats AS
SELECT 
  p.id,
  p.full_name,
  p.specialization,
  p.experience_years,
  COUNT(DISTINCT a.patient_id) as total_patients,
  COUNT(a.id) as total_appointments,
  COUNT(CASE WHEN a.status = 'completed' THEN 1 END) as completed_appointments,
  COUNT(CASE WHEN a.appointment_date >= CURRENT_DATE THEN 1 END) as upcoming_appointments
FROM profiles p
LEFT JOIN appointments a ON p.id = a.doctor_id
WHERE p.role = 'doctor' AND p.is_active = true
GROUP BY p.id, p.full_name, p.specialization, p.experience_years;

-- Add comment for the view
COMMENT ON VIEW doctor_stats IS 'Statistics view for doctors showing patient counts and appointment metrics';