-- Create database (run this separately if needed)
-- CREATE DATABASE knowledge_search;

-- Connect to the database
\c knowledge_search;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename VARCHAR(255) NOT NULL,
  original_filename VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  content_text TEXT,
  search_vector tsvector,
  uploaded_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create index for full-text search
CREATE INDEX IF NOT EXISTS idx_documents_search ON documents USING GIN(search_vector);

-- Create index for uploaded_at for sorting
CREATE INDEX IF NOT EXISTS idx_documents_uploaded_at ON documents(uploaded_at DESC);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create document_categories junction table
CREATE TABLE IF NOT EXISTS document_categories (
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (document_id, category_id)
);

-- Insert predefined categories
INSERT INTO categories (name) VALUES
  ('Marketing'),
  ('Sales'),
  ('Product'),
  ('Design'),
  ('Strategy'),
  ('Campaign'),
  ('Research'),
  ('Analytics'),
  ('Content'),
  ('Social Media')
ON CONFLICT (name) DO NOTHING;

-- Create function to update search_vector automatically
CREATE OR REPLACE FUNCTION update_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('english', COALESCE(NEW.original_filename, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.content_text, '')), 'B');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update search_vector on insert/update
DROP TRIGGER IF EXISTS documents_search_vector_update ON documents;
CREATE TRIGGER documents_search_vector_update
  BEFORE INSERT OR UPDATE ON documents
  FOR EACH ROW
  EXECUTE FUNCTION update_search_vector();
