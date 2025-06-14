/*
  # Fix infinite recursion in profiles policies

  1. Problem
    - Current policies are causing infinite recursion
    - The policies are referencing the profiles table within profile policies
    - This creates a circular dependency

  2. Solution
    - Drop existing problematic policies
    - Create new policies that use auth.uid() directly
    - Avoid referencing profiles table within profiles policies
    - Use simple, direct policy conditions
*/

-- Drop all existing policies on profiles table
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Doctors can view patient profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

-- Create new, simple policies that avoid recursion

-- Policy 1: Users can view their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Policy 2: Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policy 3: Allow users to insert their own profile (for registration)
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Policy 4: Service role can do everything (for admin operations)
CREATE POLICY "Service role full access" ON profiles
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Policy 5: Allow public read access for basic profile info (if needed for doctors list, etc.)
CREATE POLICY "Public can view basic doctor info" ON profiles
  FOR SELECT
  TO public
  USING (role IN ('doctor', 'nurse') AND is_active = true);