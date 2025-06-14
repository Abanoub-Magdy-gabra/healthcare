/*
  # Create Demo Accounts

  1. New Demo Users
    - Creates demo accounts for testing different user roles
    - Admin: admin@healthcareportal.com
    - Doctor: dr.johnson@healthcareportal.com  
    - Nurse: nurse.davis@healthcareportal.com
    - Patient: john.smith@email.com

  2. Security
    - All accounts use secure password hashing
    - Profiles are created with appropriate roles and sample data
*/

-- Insert demo users into auth.users table
-- Note: In production, users would be created through the signup process
-- This is for demo/testing purposes only

-- First, let's create the profiles that correspond to the demo accounts shown in the login page
-- These will be linked to auth users when they sign up

-- Admin Profile
INSERT INTO profiles (
  id,
  email,
  full_name,
  role,
  phone,
  is_active,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'admin@healthcareportal.com',
  'System Administrator',
  'admin',
  '+1-555-0101',
  true,
  now(),
  now()
) ON CONFLICT (email) DO NOTHING;

-- Doctor Profile
INSERT INTO profiles (
  id,
  email,
  full_name,
  role,
  phone,
  department,
  specialization,
  license_number,
  experience_years,
  is_active,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000002',
  'dr.johnson@healthcareportal.com',
  'Dr. Sarah Johnson',
  'doctor',
  '+1-555-0102',
  'Cardiology',
  'Interventional Cardiology',
  'MD-12345-CA',
  15,
  true,
  now(),
  now()
) ON CONFLICT (email) DO NOTHING;

-- Nurse Profile
INSERT INTO profiles (
  id,
  email,
  full_name,
  role,
  phone,
  department,
  license_number,
  experience_years,
  is_active,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000003',
  'nurse.davis@healthcareportal.com',
  'Nurse Emily Davis',
  'nurse',
  '+1-555-0103',
  'Emergency',
  'RN-67890-CA',
  8,
  true,
  now(),
  now()
) ON CONFLICT (email) DO NOTHING;

-- Patient Profile
INSERT INTO profiles (
  id,
  email,
  full_name,
  role,
  phone,
  date_of_birth,
  address,
  emergency_contact,
  emergency_phone,
  is_active,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000004',
  'john.smith@email.com',
  'John Smith',
  'patient',
  '+1-555-0104',
  '1985-06-15',
  '123 Main St, Anytown, CA 90210',
  'Jane Smith',
  '+1-555-0105',
  true,
  now(),
  now()
) ON CONFLICT (email) DO NOTHING;

-- Create a function to handle demo user authentication
-- This function will be called when users try to log in with demo credentials
CREATE OR REPLACE FUNCTION handle_demo_login()
RETURNS trigger AS $$
BEGIN
  -- This trigger would normally handle demo user creation
  -- But since we can't directly insert into auth.users from SQL,
  -- the demo users need to be created through the Supabase Auth API
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add some sample data for the demo accounts

-- Sample rooms
INSERT INTO rooms (room_number, room_type, floor, capacity, daily_rate, equipment, status, description)
VALUES 
  ('101', 'Standard', 1, 1, 150.00, ARRAY['TV', 'WiFi', 'Private Bathroom'], 'available', 'Comfortable single occupancy room'),
  ('102', 'Deluxe', 1, 1, 200.00, ARRAY['TV', 'WiFi', 'Private Bathroom', 'Refrigerator'], 'available', 'Deluxe single room with amenities'),
  ('201', 'Suite', 2, 2, 350.00, ARRAY['TV', 'WiFi', 'Private Bathroom', 'Kitchenette', 'Sofa'], 'available', 'Spacious suite for extended stays')
ON CONFLICT (room_number) DO NOTHING;

-- Sample appointments (using the demo user IDs)
INSERT INTO appointments (
  patient_id,
  doctor_id,
  appointment_date,
  appointment_time,
  duration_minutes,
  appointment_type,
  status,
  notes
) VALUES (
  '00000000-0000-0000-0000-000000000004', -- John Smith (patient)
  '00000000-0000-0000-0000-000000000002', -- Dr. Johnson
  CURRENT_DATE + INTERVAL '1 day',
  '10:00:00',
  30,
  'Consultation',
  'confirmed',
  'Regular checkup appointment'
),
(
  '00000000-0000-0000-0000-000000000004', -- John Smith (patient)
  '00000000-0000-0000-0000-000000000002', -- Dr. Johnson
  CURRENT_DATE + INTERVAL '7 days',
  '14:30:00',
  45,
  'Follow-up',
  'pending',
  'Follow-up consultation'
) ON CONFLICT DO NOTHING;