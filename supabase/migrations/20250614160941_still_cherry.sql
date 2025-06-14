/*
  # Add education column to profiles table

  1. Changes
    - Add `education` column to `profiles` table
    - Column will be nullable text type to store educational background information
    
  2. Notes
    - This resolves the error where the application tries to update/insert education data
    - Existing profiles will have NULL values for education initially
*/

-- Add education column to profiles table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'education'
  ) THEN
    ALTER TABLE profiles ADD COLUMN education text;
  END IF;
END $$;