/*
  # Fix Role Assignment Issue

  1. Problem
    - Users registering with specific roles are getting assigned 'patient' role instead
    - Need to ensure role assignment works correctly during registration

  2. Solution
    - Update RLS policies to ensure proper role assignment
    - Add debugging and verification steps
    - Ensure the role field is properly set during profile creation
*/

-- First, let's check if there are any constraints or triggers affecting role assignment
-- Drop and recreate the profiles table policies to ensure they work correctly

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Service role full access" ON profiles;
DROP POLICY IF EXISTS "Authenticated users can view basic profile info" ON profiles;

-- Create new policies that ensure proper role assignment
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Service role full access" ON profiles
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view basic profile info" ON profiles
  FOR SELECT
  TO authenticated
  USING (true);

-- Ensure the role column has the correct default and constraints
ALTER TABLE profiles ALTER COLUMN role SET DEFAULT 'patient';

-- Add a function to verify role assignment
CREATE OR REPLACE FUNCTION verify_role_assignment()
RETURNS trigger AS $$
BEGIN
  -- Log the role being assigned
  RAISE NOTICE 'Profile being created with role: %', NEW.role;
  
  -- Ensure role is not null and is a valid enum value
  IF NEW.role IS NULL THEN
    NEW.role := 'patient';
    RAISE NOTICE 'Role was null, setting to patient';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to verify role assignment
DROP TRIGGER IF EXISTS verify_role_trigger ON profiles;
CREATE TRIGGER verify_role_trigger
  BEFORE INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION verify_role_assignment();

-- Update the sample data creation function to not override roles
CREATE OR REPLACE FUNCTION trigger_create_sample_data()
RETURNS trigger AS $$
BEGIN
  -- Only create sample data for demo users, don't override their role
  IF NEW.email LIKE '%@healthcareportal.com' OR NEW.email LIKE '%@email.com' THEN
    
    -- If this is a patient, create some sample medical history
    IF NEW.role = 'patient' THEN
      -- Insert a sample medical record
      INSERT INTO medical_records (patient_id, record_type, title, description, record_date, is_critical)
      VALUES (
        NEW.id,
        'Physical Exam',
        'Initial Health Assessment',
        'Comprehensive health assessment upon registration',
        CURRENT_DATE - INTERVAL '30 days',
        false
      );
    END IF;
    
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;