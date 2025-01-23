/*
  # Initial Schema for Vehicle Insurance System

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key)
      - `email` (text)
      - `full_name` (text)
      - `created_at` (timestamp)
    - `vehicles`
      - `id` (uuid, primary key)
      - `plate` (text)
      - `model` (text)
      - `year` (integer)
      - `color` (text)
      - `chassis` (text)
      - `owner_id` (uuid, foreign key)
      - `created_at` (timestamp)
    - `policies`
      - `id` (uuid, primary key)
      - `vehicle_id` (uuid, foreign key)
      - `start_date` (timestamp)
      - `end_date` (timestamp)
      - `premium_amount` (decimal)
      - `status` (text)
      - `created_at` (timestamp)
    - `claims`
      - `id` (uuid, primary key)
      - `vehicle_id` (uuid, foreign key)
      - `incident_date` (timestamp)
      - `description` (text)
      - `status` (text)
      - `created_at` (timestamp)
    - `trackers`
      - `id` (uuid, primary key)
      - `vehicle_id` (uuid, foreign key)
      - `last_latitude` (decimal)
      - `last_longitude` (decimal)
      - `last_update` (timestamp)
      - `status` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Vehicles table
CREATE TABLE vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plate text NOT NULL,
  model text NOT NULL,
  year integer NOT NULL,
  color text,
  chassis text UNIQUE,
  owner_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own vehicles"
  ON vehicles FOR SELECT
  TO authenticated
  USING (owner_id = auth.uid());

CREATE POLICY "Users can insert own vehicles"
  ON vehicles FOR INSERT
  TO authenticated
  WITH CHECK (owner_id = auth.uid());

-- Policies table
CREATE TABLE policies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id uuid REFERENCES vehicles(id) ON DELETE CASCADE,
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  premium_amount decimal NOT NULL,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE policies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own policies"
  ON policies FOR SELECT
  TO authenticated
  USING (
    vehicle_id IN (
      SELECT id FROM vehicles WHERE owner_id = auth.uid()
    )
  );

-- Claims table
CREATE TABLE claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id uuid REFERENCES vehicles(id) ON DELETE CASCADE,
  incident_date timestamptz NOT NULL,
  description text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE claims ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own claims"
  ON claims FOR SELECT
  TO authenticated
  USING (
    vehicle_id IN (
      SELECT id FROM vehicles WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own claims"
  ON claims FOR INSERT
  TO authenticated
  WITH CHECK (
    vehicle_id IN (
      SELECT id FROM vehicles WHERE owner_id = auth.uid()
    )
  );

-- Trackers table
CREATE TABLE trackers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id uuid REFERENCES vehicles(id) ON DELETE CASCADE,
  last_latitude decimal,
  last_longitude decimal,
  last_update timestamptz DEFAULT now(),
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE trackers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own trackers"
  ON trackers FOR SELECT
  TO authenticated
  USING (
    vehicle_id IN (
      SELECT id FROM vehicles WHERE owner_id = auth.uid()
    )
  );