/*
  # Fix role default value issue
  
  1. Problem
    - The profiles table has a default value of 'patient' for the role column
    - This is overriding the role selection during registration
    
  2. Solution
    - Remove the default value from the role column
    - Ensure role is always explicitly set during registration
*/

-- Remove the default value from the role column
ALTER TABLE profiles ALTER COLUMN role DROP DEFAULT;

-- Make role column NOT NULL to ensure it's always provided
ALTER TABLE profiles ALTER COLUMN role SET NOT NULL;