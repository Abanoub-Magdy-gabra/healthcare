/*
  # Demo Account Setup Migration
  
  1. Problem
    - Cannot directly insert into profiles table without corresponding auth.users entries
    - Foreign key constraint prevents creating profiles without auth users
    
  2. Solution
    - Create helper functions and views for demo account management
    - Provide instructions for creating demo accounts through registration
    - Set up sample data that will be available once demo accounts are created
*/

-- Create a view that shows the demo account information
CREATE OR REPLACE VIEW demo_accounts_info AS
SELECT 
  'admin@healthcareportal.com' as email,
  'admin123' as password,
  'admin' as role,
  'System Administrator - Full system access' as description
UNION ALL
SELECT 
  'dr.johnson@healthcareportal.com' as email,
  'doctor123' as password,
  'doctor' as role,
  'Dr. Sarah Johnson - Cardiologist' as description
UNION ALL
SELECT 
  'nurse.davis@healthcareportal.com' as email,
  'nurse123' as password,
  'nurse' as role,
  'Emily Davis - Emergency Care Nurse' as description
UNION ALL
SELECT 
  'john.smith@email.com' as email,
  'patient123' as password,
  'patient' as role,
  'John Smith - Demo Patient' as description;

-- Add comment explaining how to use demo accounts
COMMENT ON VIEW demo_accounts_info IS 'Demo accounts for testing. Users must register with these credentials through the signup process first.';

-- Create a function to set up demo-specific data when demo users register
CREATE OR REPLACE FUNCTION setup_demo_user_data(user_id uuid, user_email text, user_role user_role)
RETURNS void AS $$
BEGIN
  -- Only create demo data for the specific demo accounts
  IF user_email IN (
    'admin@healthcareportal.com',
    'dr.johnson@healthcareportal.com', 
    'nurse.davis@healthcareportal.com',
    'john.smith@email.com'
  ) THEN
    
    -- Set up role-specific demo data
    CASE user_role
      WHEN 'admin' THEN
        -- Admin gets access to system overview data
        INSERT INTO audit_logs (user_id, action, table_name, old_values, new_values, ip_address)
        VALUES (
          user_id,
          'DEMO_LOGIN',
          'auth',
          NULL,
          jsonb_build_object('role', 'admin', 'demo_account', true),
          '127.0.0.1'::inet
        );
        
      WHEN 'doctor' THEN
        -- Doctor gets some sample medical records they can view
        -- These will be linked to patients when they exist
        NULL; -- Appointments will be created through normal booking process
        
      WHEN 'nurse' THEN
        -- Nurse gets availability for home visits
        NULL; -- Nurse requests will be created through normal request process
        
      WHEN 'patient' THEN
        -- Patient gets a sample medical record
        INSERT INTO medical_records (
          patient_id,
          record_type,
          title,
          description,
          record_date,
          is_critical
        ) VALUES (
          user_id,
          'Physical Exam',
          'Welcome Health Assessment',
          'Initial health assessment for new patient registration',
          CURRENT_DATE - INTERVAL '30 days',
          false
        );
        
    END CASE;
    
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the existing trigger function to use the new demo setup function
CREATE OR REPLACE FUNCTION trigger_create_sample_data()
RETURNS trigger AS $$
BEGIN
  -- Call the demo setup function for demo accounts
  PERFORM setup_demo_user_data(NEW.id, NEW.email, NEW.role);
  
  -- Call the original sample data function for other accounts if it exists
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'create_sample_data_for_user') THEN
    PERFORM create_sample_data_for_user(NEW.id, NEW.email, NEW.role);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function that can be called to check if demo users exist
CREATE OR REPLACE FUNCTION check_demo_users_status()
RETURNS TABLE(
  email text,
  user_exists boolean,
  role user_role,
  created_at timestamptz
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    demo.email,
    (p.id IS NOT NULL) as user_exists,
    p.role,
    p.created_at
  FROM (
    VALUES 
      ('admin@healthcareportal.com'),
      ('dr.johnson@healthcareportal.com'),
      ('nurse.davis@healthcareportal.com'),
      ('john.smith@email.com')
  ) AS demo(email)
  LEFT JOIN profiles p ON p.email = demo.email;
END;
$$ LANGUAGE plpgsql;

-- Create a function to create demo messages once users exist
CREATE OR REPLACE FUNCTION create_demo_messages()
RETURNS void AS $$
DECLARE
  admin_id uuid;
  doctor_id uuid;
  nurse_id uuid;
  patient_id uuid;
BEGIN
  -- Get demo user IDs if they exist
  SELECT id INTO admin_id FROM profiles WHERE email = 'admin@healthcareportal.com';
  SELECT id INTO doctor_id FROM profiles WHERE email = 'dr.johnson@healthcareportal.com';
  SELECT id INTO nurse_id FROM profiles WHERE email = 'nurse.davis@healthcareportal.com';
  SELECT id INTO patient_id FROM profiles WHERE email = 'john.smith@email.com';
  
  -- Create messages between demo users if they exist
  IF admin_id IS NOT NULL AND doctor_id IS NOT NULL THEN
    INSERT INTO messages (sender_id, recipient_id, subject, content, priority, is_read)
    VALUES (
      admin_id,
      doctor_id,
      'Welcome to the Healthcare Portal',
      'Welcome to our healthcare management system. Your doctor account has been activated.',
      'medium',
      false
    ) ON CONFLICT DO NOTHING;
  END IF;
  
  IF doctor_id IS NOT NULL AND patient_id IS NOT NULL THEN
    INSERT INTO messages (sender_id, recipient_id, subject, content, priority, is_read)
    VALUES (
      doctor_id,
      patient_id,
      'Appointment Reminder',
      'This is a reminder for your upcoming appointment. Please arrive 15 minutes early.',
      'high',
      false
    ) ON CONFLICT DO NOTHING;
  END IF;
  
END;
$$ LANGUAGE plpgsql;

-- Add more sample rooms for testing
INSERT INTO rooms (room_number, room_type, floor, capacity, daily_rate, equipment, status, description)
VALUES 
  ('103', 'Standard', 1, 1, 150.00, ARRAY['TV', 'WiFi', 'Private Bathroom'], 'available', 'Comfortable single occupancy room'),
  ('104', 'Deluxe', 1, 1, 200.00, ARRAY['TV', 'WiFi', 'Private Bathroom', 'Refrigerator'], 'available', 'Deluxe single room with amenities'),
  ('105', 'Suite', 1, 2, 350.00, ARRAY['TV', 'WiFi', 'Private Bathroom', 'Kitchenette', 'Sofa'], 'available', 'Spacious suite for extended stays'),
  ('203', 'ICU', 2, 1, 500.00, ARRAY['ICU Bed', 'Ventilator', 'Heart Monitor', 'IV Stand'], 'available', 'Intensive Care Unit'),
  ('204', 'Maternity', 2, 1, 300.00, ARRAY['Adjustable Bed', 'Baby Crib', 'TV', 'Private Bathroom'], 'available', 'Maternity ward room'),
  ('303', 'Pediatric', 3, 1, 200.00, ARRAY['Pediatric Bed', 'TV', 'Play Area', 'Private Bathroom'], 'available', 'Child-friendly room'),
  ('304', 'Emergency', 3, 1, 350.00, ARRAY['Emergency Bed', 'Defibrillator', 'Oxygen Supply'], 'available', 'Emergency department room')
ON CONFLICT (room_number) DO NOTHING;

-- Add helpful system data
INSERT INTO audit_logs (action, table_name, old_values, new_values, ip_address, created_at)
VALUES (
  'SYSTEM_INIT',
  'demo_setup',
  NULL,
  jsonb_build_object(
    'message', 'Demo environment initialized',
    'available_accounts', 4,
    'setup_date', CURRENT_DATE,
    'instructions', 'Demo users must register through the signup process first'
  ),
  '127.0.0.1'::inet,
  now()
);

-- Add helpful comments
COMMENT ON FUNCTION setup_demo_user_data IS 'Sets up demo-specific data when demo users register';
COMMENT ON FUNCTION create_demo_messages IS 'Creates sample messages between demo users';
COMMENT ON FUNCTION check_demo_users_status IS 'Check which demo users have been created';

-- Create a helpful instruction function
CREATE OR REPLACE FUNCTION get_demo_setup_instructions()
RETURNS text AS $$
BEGIN
  RETURN 'To use demo accounts:
1. Go to the registration page
2. Register with one of these emails: admin@healthcareportal.com, dr.johnson@healthcareportal.com, nurse.davis@healthcareportal.com, john.smith@email.com
3. Use the corresponding passwords: admin123, doctor123, nurse123, patient123
4. Select the appropriate role during registration
5. After registration, you can login with these credentials

The system will automatically set up demo data for these accounts.';
END;
$$ LANGUAGE plpgsql;