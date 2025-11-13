-- Create the books table for the book collection manager
-- Run this migration in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS books (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  tags TEXT[], -- Array of text tags (e.g., ['IT', 'Programming'])
  cover_url TEXT, -- Nullable cover image URL
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create an index on title for faster searches
CREATE INDEX IF NOT EXISTS idx_books_title ON books(title);

-- Create an index on tags for faster filtering
CREATE INDEX IF NOT EXISTS idx_books_tags ON books USING GIN(tags);

-- Enable Row Level Security (optional, but recommended)
-- Since we're not using authentication, we'll allow all operations
ALTER TABLE books ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations (since no auth is required)
CREATE POLICY "Allow all operations on books" ON books
  FOR ALL
  USING (true)
  WITH CHECK (true);

