/*
  # Create Event Management Database Schema

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `name` (text, user's full name)
      - `email` (text, unique email address)
      - `role` (enum, user role: admin, organizer, attendee)
      - `avatar` (text, optional avatar URL)
      - `created_at` (timestamptz, creation timestamp)
      - `updated_at` (timestamptz, last update timestamp)

    - `events`
      - `id` (uuid, primary key)
      - `title` (text, event title)
      - `description` (text, event description)
      - `date` (date, event date)
      - `time` (time, event time)
      - `location` (text, event location)
      - `category` (enum, event category)
      - `status` (enum, event status)
      - `attendees` (integer, current attendee count)
      - `max_attendees` (integer, maximum attendees allowed)
      - `price` (decimal, event price)
      - `image` (text, optional event image URL)
      - `organizer` (text, organizer name)
      - `created_at` (timestamptz, creation timestamp)
      - `updated_at` (timestamptz, last update timestamp)

    - `event_registrations`
      - `id` (uuid, primary key)
      - `event_id` (uuid, foreign key to events)
      - `user_id` (uuid, foreign key to users)
      - `registration_date` (timestamptz, registration timestamp)
      - `status` (enum, registration status)
      - `created_at` (timestamptz, creation timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their data
    - Add policies for event management and registration

  3. Indexes
    - Add indexes for frequently queried columns
    - Add composite indexes for complex queries
*/

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'organizer', 'attendee');
CREATE TYPE event_category AS ENUM ('conference', 'workshop', 'seminar', 'networking', 'social', 'other');
CREATE TYPE event_status AS ENUM ('draft', 'published', 'cancelled', 'completed');
CREATE TYPE registration_status AS ENUM ('registered', 'cancelled', 'attended');

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  role user_role DEFAULT 'attendee',
  avatar text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  date date NOT NULL,
  time time NOT NULL,
  location text NOT NULL,
  category event_category DEFAULT 'other',
  status event_status DEFAULT 'draft',
  attendees integer DEFAULT 0,
  max_attendees integer NOT NULL CHECK (max_attendees > 0),
  price decimal(10,2) DEFAULT 0.00,
  image text,
  organizer text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create event_registrations table
CREATE TABLE IF NOT EXISTS event_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  registration_date timestamptz DEFAULT now(),
  status registration_status DEFAULT 'registered',
  created_at timestamptz DEFAULT now(),
  UNIQUE(event_id, user_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);
CREATE INDEX IF NOT EXISTS idx_events_organizer ON events(organizer);
CREATE INDEX IF NOT EXISTS idx_event_registrations_event_id ON event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_user_id ON event_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users table
CREATE POLICY "Users can read all user profiles"
  ON users
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = id);

CREATE POLICY "Users can insert their own profile"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = id);

-- Create RLS policies for events table
CREATE POLICY "Anyone can read published events"
  ON events
  FOR SELECT
  TO authenticated
  USING (status = 'published' OR auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can create events"
  ON events
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own events"
  ON events
  FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete their own events"
  ON events
  FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- Create RLS policies for event_registrations table
CREATE POLICY "Users can read their own registrations"
  ON event_registrations
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can register for events"
  ON event_registrations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own registrations"
  ON event_registrations
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can cancel their own registrations"
  ON event_registrations
  FOR DELETE
  TO authenticated
  USING (auth.uid()::text = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO users (id, name, email, role) VALUES
  ('550e8400-e29b-41d4-a716-446655440000', 'Admin User', 'admin@eventpro.com', 'admin'),
  ('550e8400-e29b-41d4-a716-446655440001', 'John Organizer', 'john@eventpro.com', 'organizer'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Jane Attendee', 'jane@eventpro.com', 'attendee')
ON CONFLICT (email) DO NOTHING;

INSERT INTO events (title, description, date, time, location, category, status, attendees, max_attendees, price, image, organizer) VALUES
  (
    'Tech Innovation Summit 2024',
    'Join industry leaders for cutting-edge technology discussions and networking opportunities.',
    '2024-03-15',
    '09:00',
    'San Francisco Convention Center',
    'conference',
    'published',
    245,
    500,
    299.00,
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop',
    'TechCorp Events'
  ),
  (
    'Digital Marketing Workshop',
    'Learn the latest digital marketing strategies from industry experts.',
    '2024-03-22',
    '14:00',
    'Downtown Business Center',
    'workshop',
    'published',
    89,
    150,
    149.00,
    'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=400&fit=crop',
    'Marketing Pro'
  ),
  (
    'Startup Networking Night',
    'Connect with fellow entrepreneurs and potential investors in a relaxed atmosphere.',
    '2024-03-28',
    '18:30',
    'Rooftop Lounge, City Center',
    'networking',
    'published',
    156,
    200,
    75.00,
    'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=400&fit=crop',
    'Startup Hub'
  ),
  (
    'AI & Machine Learning Seminar',
    'Explore the future of artificial intelligence and its applications across industries.',
    '2024-04-05',
    '10:00',
    'University Tech Campus',
    'seminar',
    'draft',
    0,
    300,
    199.00,
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=400&fit=crop',
    'AI Research Institute'
  )
ON CONFLICT DO NOTHING;