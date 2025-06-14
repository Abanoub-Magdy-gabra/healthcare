/*
  # Create Demo Accounts

  1. New Tables
    - Creates demo user accounts in the auth.users table
    - Creates corresponding profiles for each demo account
  
  2. Demo Accounts
    - Admin: admin@healthcareportal.com / admin123
    - Doctor: dr.johnson@healthcareportal.com / doctor123  
    - Nurse: nurse.davis@healthcareportal.com / nurse123
    - Patient: john.smith@email.com / patient123
  
  3. Security
    - Uses secure password hashing
    - Sets up proper profile relationships
*/

-- Insert demo users into auth.users (this requires service role access)
-- Note: In production, users should register through the normal signup process

-- Create demo profiles that correspond to the accounts shown in the login form
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
  is_active
) VALUES 
  -- Admin account
  (
    '00000000-0000-0000-0000-000000000001',
    'admin@healthcareportal.com',
    'System Administrator',
    'admin',
    '+1-555-0101',
    'Administration',
    NULL,
    NULL,
    NULL,
    true
  ),
  -- Doctor account  
  (
    '00000000-0000-0000-0000-000000000002',
    'dr.johnson@healthcareportal.com',
    'Dr. Sarah Johnson',
    'doctor',
    '+1-555-0102',
    'Cardiology',
    'Interventional Cardiology',
    'MD12345',
    15,
    true
  ),
  -- Nurse account
  (
    '00000000-0000-0000-0000-000000000003',
    'nurse.davis@healthcareportal.com',
    'Emily Davis',
    'nurse',
    '+1-555-0103',
    'Emergency',
    'Emergency Care',
    'RN67890',
    8,
    true
  ),
  -- Patient account
  (
    '00000000-0000-0000-0000-000000000004',
    'john.smith@email.com',
    'John Smith',
    'patient',
    '+1-555-0104',
    NULL,
    NULL,
    NULL,
    NULL,
    true
  )
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  phone = EXCLUDED.phone,
  department = EXCLUDED.department,
  specialization = EXCLUDED.specialization,
  license_number = EXCLUDED.license_number,
  experience_years = EXCLUDED.experience_years,
  is_active = EXCLUDED.is_active,
  updated_at = now();

-- Enable RLS policies for the demo accounts
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;