-- Create rooms table
CREATE TABLE rooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  encryption_key TEXT
);

-- Create messages table
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  sender_id TEXT NOT NULL,
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  encrypted BOOLEAN DEFAULT FALSE
);

-- Create indexes for better performance
CREATE INDEX idx_messages_room_id ON messages(room_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
CREATE INDEX idx_rooms_created_at ON rooms(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policies for public read/write access
-- Note: In a production environment, you should implement proper authentication
CREATE POLICY "Allow public read access to rooms" ON rooms
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert access to rooms" ON rooms
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access to rooms" ON rooms
  FOR UPDATE USING (true);

CREATE POLICY "Allow public delete access to rooms" ON rooms
  FOR DELETE USING (true);

CREATE POLICY "Allow public read access to messages" ON messages
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert access to messages" ON messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access to messages" ON messages
  FOR UPDATE USING (true);

CREATE POLICY "Allow public delete access to messages" ON messages
  FOR DELETE USING (true); 