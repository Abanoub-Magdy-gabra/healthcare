/*
  # Add bio column to profiles table

  1. Changes
    - Add `bio` column to `profiles` table
    - Column type: text (nullable)
    - Allows users to add a professional bio/description to their profile

  2. Security
    - No changes to existing RLS policies needed
    - Bio column will be accessible through existing profile policies
*/

-- Add bio column to profiles table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'bio'
  ) THEN
    ALTER TABLE profiles ADD COLUMN bio text;
  END IF;
END $$;