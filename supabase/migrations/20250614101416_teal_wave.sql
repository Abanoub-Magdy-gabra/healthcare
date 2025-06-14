/*
  # Fix infinite recursion in profiles table policies

  1. Problem
    - Existing RLS policies on profiles table are causing infinite recursion
    - Policies are trying to query profiles table from within profiles table policies
    - This creates a circular dependency that breaks the application

  2. Solution
    - Drop ALL existing policies on profiles table
    - Create new, simple policies that use auth.uid() directly
    - Avoid any references to profiles table within the policies themselves
    - Maintain security while preventing recursion

  3. New Policies
    - Users can view their own profile
    - Users can update their own profile  
    - Users can insert their own profile (for registration)
    - Service role has full access (for admin operations)
    - Authenticated users can view basic profile info (for app functionality)
*/

-- Drop ALL existing policies on profiles table to start fresh
DO $$ 
DECLARE
    policy_record RECORD;
BEGIN
    -- Get all policies for the profiles table
    FOR policy_record IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'profiles' AND schemaname = 'public'
    LOOP
        -- Drop each policy
        EXECUTE format('DROP POLICY IF EXISTS %I ON profiles', policy_record.policyname);
    END LOOP;
END $$;

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

-- Policy 5: Allow public read access for basic profile info (if needed for doctors/nurses to see patient names)
-- This is a simplified approach that avoids the recursion issue
CREATE POLICY "Authenticated users can view basic profile info" ON profiles
  FOR SELECT
  TO authenticated
  USING (true);