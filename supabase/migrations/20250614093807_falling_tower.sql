/*
  # Healthcare Portal Database Schema

  1. New Tables
    - `profiles` - User profiles with role-based information
    - `appointments` - Medical appointments between patients and doctors
    - `medical_records` - Patient medical history and test results
    - `room_bookings` - Hospital room reservations
    - `payments` - Billing and payment records
    - `messages` - Communication between users
    - `rooms` - Hospital room inventory
    - `audit_logs` - System activity tracking
    - `nurse_requests` - Home nursing service requests

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access control
    - Secure data access based on user roles

  3. Functions
    - Custom functions for complex queries
    - Triggers for audit logging
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE user_role AS ENUM ('patient', 'doctor', 'nurse', 'admin');
CREATE TYPE appointment_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'overdue', 'cancelled');
CREATE TYPE room_status AS ENUM ('available', 'occupied', 'maintenance', 'reserved');
CREATE TYPE request_status AS ENUM ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled');
CREATE TYPE priority_level AS ENUM ('low', 'medium', 'high', 'urgent');

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  role user_role NOT NULL DEFAULT 'patient',
  phone text,
  date_of_birth date,
  address text,
  emergency_contact text,
  emergency_phone text,
  department text,
  license_number text,
  specialization text,
  experience_years integer,
  is_active boolean DEFAULT true,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_number text UNIQUE NOT NULL,
  room_type text NOT NULL,
  floor integer NOT NULL,
  capacity integer DEFAULT 1,
  daily_rate decimal(10,2) NOT NULL,
  equipment text[] DEFAULT '{}',
  status room_status DEFAULT 'available',
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  doctor_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  appointment_date date NOT NULL,
  appointment_time time NOT NULL,
  duration_minutes integer DEFAULT 30,
  appointment_type text NOT NULL,
  status appointment_status DEFAULT 'pending',
  notes text,
  diagnosis text,
  prescription text,
  follow_up_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Medical records table
CREATE TABLE IF NOT EXISTS medical_records (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  doctor_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  record_type text NOT NULL,
  title text NOT NULL,
  description text,
  test_results jsonb,
  attachments text[],
  record_date date NOT NULL,
  is_critical boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Room bookings table
CREATE TABLE IF NOT EXISTS room_bookings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  room_id uuid REFERENCES rooms(id) ON DELETE CASCADE,
  check_in_date date NOT NULL,
  check_out_date date NOT NULL,
  total_cost decimal(10,2),
  status request_status DEFAULT 'pending',
  special_requirements text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  appointment_id uuid REFERENCES appointments(id) ON DELETE SET NULL,
  room_booking_id uuid REFERENCES room_bookings(id) ON DELETE SET NULL,
  amount decimal(10,2) NOT NULL,
  description text NOT NULL,
  payment_method text,
  status payment_status DEFAULT 'pending',
  due_date date,
  paid_date date,
  invoice_number text UNIQUE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  recipient_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  subject text NOT NULL,
  content text NOT NULL,
  priority priority_level DEFAULT 'medium',
  is_read boolean DEFAULT false,
  parent_message_id uuid REFERENCES messages(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Nurse requests table
CREATE TABLE IF NOT EXISTS nurse_requests (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  nurse_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  request_type text NOT NULL,
  description text NOT NULL,
  address text NOT NULL,
  requested_date date NOT NULL,
  requested_time time NOT NULL,
  duration_hours integer DEFAULT 2,
  priority priority_level DEFAULT 'medium',
  status request_status DEFAULT 'pending',
  services text[] DEFAULT '{}',
  special_instructions text,
  estimated_cost decimal(10,2),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  action text NOT NULL,
  table_name text,
  record_id uuid,
  old_values jsonb,
  new_values jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE nurse_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Doctors can view patient profiles" ON profiles
  FOR SELECT USING (
    role = 'patient' AND EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role IN ('doctor', 'nurse', 'admin')
    )
  );

-- Rooms policies
CREATE POLICY "Anyone can view available rooms" ON rooms
  FOR SELECT USING (status = 'available');

CREATE POLICY "Admins can manage rooms" ON rooms
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Appointments policies
CREATE POLICY "Patients can view own appointments" ON appointments
  FOR SELECT USING (patient_id = auth.uid());

CREATE POLICY "Doctors can view their appointments" ON appointments
  FOR SELECT USING (doctor_id = auth.uid());

CREATE POLICY "Patients can create appointments" ON appointments
  FOR INSERT WITH CHECK (patient_id = auth.uid());

CREATE POLICY "Doctors can update their appointments" ON appointments
  FOR UPDATE USING (doctor_id = auth.uid());

-- Medical records policies
CREATE POLICY "Patients can view own medical records" ON medical_records
  FOR SELECT USING (patient_id = auth.uid());

CREATE POLICY "Doctors can view patient records" ON medical_records
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role IN ('doctor', 'nurse')
    )
  );

CREATE POLICY "Doctors can create medical records" ON medical_records
  FOR INSERT WITH CHECK (
    doctor_id = auth.uid() AND EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'doctor'
    )
  );

-- Room bookings policies
CREATE POLICY "Patients can view own bookings" ON room_bookings
  FOR SELECT USING (patient_id = auth.uid());

CREATE POLICY "Patients can create bookings" ON room_bookings
  FOR INSERT WITH CHECK (patient_id = auth.uid());

CREATE POLICY "Staff can view all bookings" ON room_bookings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role IN ('doctor', 'nurse', 'admin')
    )
  );

-- Payments policies
CREATE POLICY "Patients can view own payments" ON payments
  FOR SELECT USING (patient_id = auth.uid());

CREATE POLICY "Admins can view all payments" ON payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Messages policies
CREATE POLICY "Users can view own messages" ON messages
  FOR SELECT USING (sender_id = auth.uid() OR recipient_id = auth.uid());

CREATE POLICY "Users can send messages" ON messages
  FOR INSERT WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Users can update own messages" ON messages
  FOR UPDATE USING (recipient_id = auth.uid());

-- Nurse requests policies
CREATE POLICY "Patients can view own requests" ON nurse_requests
  FOR SELECT USING (patient_id = auth.uid());

CREATE POLICY "Nurses can view assigned requests" ON nurse_requests
  FOR SELECT USING (
    nurse_id = auth.uid() OR EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role IN ('nurse', 'admin')
    )
  );

CREATE POLICY "Patients can create requests" ON nurse_requests
  FOR INSERT WITH CHECK (patient_id = auth.uid());

-- Audit logs policies
CREATE POLICY "Admins can view audit logs" ON audit_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Functions and triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rooms_updated_at BEFORE UPDATE ON rooms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_medical_records_updated_at BEFORE UPDATE ON medical_records
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_room_bookings_updated_at BEFORE UPDATE ON room_bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON messages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_nurse_requests_updated_at BEFORE UPDATE ON nurse_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Generate invoice numbers
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.invoice_number IS NULL THEN
    NEW.invoice_number := 'INV-' || to_char(now(), 'YYYYMMDD') || '-' || 
                         lpad(nextval('invoice_sequence')::text, 4, '0');
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE SEQUENCE IF NOT EXISTS invoice_sequence START 1;

CREATE TRIGGER generate_invoice_number_trigger BEFORE INSERT ON payments
  FOR EACH ROW EXECUTE FUNCTION generate_invoice_number();

-- Insert sample data
INSERT INTO rooms (room_number, room_type, floor, daily_rate, equipment, status) VALUES
  ('101A', 'Private', 1, 300.00, '{"Heart Monitor", "IV Stand"}', 'available'),
  ('102B', 'Semi-Private', 1, 200.00, '{"Basic Monitoring"}', 'available'),
  ('201A', 'ICU', 2, 500.00, '{"Ventilator", "Heart Monitor", "IV Pump"}', 'available'),
  ('202B', 'Private', 2, 300.00, '{"Heart Monitor"}', 'maintenance'),
  ('301A', 'Deluxe', 3, 450.00, '{"Heart Monitor", "TV", "Mini Fridge"}', 'available');