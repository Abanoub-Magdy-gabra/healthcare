/*
  # Sample Data Migration for Healthcare Portal

  1. New Tables Data
    - `rooms` - Hospital rooms with different types and equipment
    - Sample data for testing the healthcare portal functionality
  
  2. Notes
    - This migration only inserts rooms and other non-user dependent data
    - User profiles will be created through the registration process
    - Sample appointments, records, etc. will be created when users register and interact with the system
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
('501A', 'Emergency', 5, 1, 350.00, ARRAY['Emergency Bed', 'Defibrillator', 'Oxygen Supply', 'Emergency Equipment'], 'available', 'Emergency department room'),
('502A', 'Emergency', 5, 1, 350.00, ARRAY['Emergency Bed', 'Defibrillator', 'Oxygen Supply', 'Emergency Equipment'], 'available', 'Emergency department room'),
('101C', 'Standard', 1, 1, 150.00, ARRAY['Bed', 'TV', 'Private Bathroom'], 'available', 'Standard single occupancy room'),
('102B', 'Deluxe', 1, 1, 250.00, ARRAY['Bed', 'TV', 'Private Bathroom', 'Refrigerator', 'Sofa'], 'available', 'Deluxe single room with amenities'),
('201C', 'ICU', 2, 1, 500.00, ARRAY['ICU Bed', 'Ventilator', 'Heart Monitor', 'IV Stand'], 'available', 'Intensive Care Unit'),
('301B', 'Suite', 3, 2, 400.00, ARRAY['King Bed', 'Sofa Bed', 'TV', 'Kitchenette', 'Private Bathroom'], 'available', 'Executive suite for extended stays')
ON CONFLICT (room_number) DO NOTHING;

-- Create a function to generate sample data when users register
-- This will be called by triggers or application code when new users are created

CREATE OR REPLACE FUNCTION create_sample_data_for_user(user_id uuid, user_email text, user_role user_role)
RETURNS void AS $$
BEGIN
  -- Only create sample data for demo users or in development
  IF user_email LIKE '%@healthcareportal.com' OR user_email LIKE '%@email.com' THEN
    
    -- If this is a doctor, create some sample appointments
    IF user_role = 'doctor' THEN
      -- Sample appointments will be created when patients book with this doctor
      NULL;
    END IF;
    
    -- If this is a patient, create some sample medical history
    IF user_role = 'patient' THEN
      -- Insert a sample medical record
      INSERT INTO medical_records (patient_id, record_type, title, description, record_date, is_critical)
      VALUES (
        user_id,
        'Physical Exam',
        'Initial Health Assessment',
        'Comprehensive health assessment upon registration',
        CURRENT_DATE - INTERVAL '30 days',
        false
      );
    END IF;
    
    -- If this is a nurse, create availability
    IF user_role = 'nurse' THEN
      -- Nurse is available for home visits
      NULL;
    END IF;
    
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger function to automatically create sample data for new profiles
CREATE OR REPLACE FUNCTION trigger_create_sample_data()
RETURNS trigger AS $$
BEGIN
  -- Call the sample data creation function
  PERFORM create_sample_data_for_user(NEW.id, NEW.email, NEW.role);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically generate sample data for new profiles
DROP TRIGGER IF EXISTS create_sample_data_trigger ON profiles;
CREATE TRIGGER create_sample_data_trigger
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION trigger_create_sample_data();

-- Insert some system-level data that doesn't depend on users

-- Create a system messages table for announcements (optional)
DO $$
BEGIN
  -- Create a system announcement if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM messages WHERE subject = 'Welcome to Healthcare Portal') THEN
    -- We'll create system messages when we have actual users
    NULL;
  END IF;
END $$;

-- Add some helpful comments for developers
COMMENT ON FUNCTION create_sample_data_for_user IS 'Creates sample data for new users based on their role';
COMMENT ON FUNCTION trigger_create_sample_data IS 'Trigger function to automatically create sample data for new profiles';
COMMENT ON TRIGGER create_sample_data_trigger ON profiles IS 'Automatically creates sample data when new profiles are inserted';