-- Create database (run this separately if needed)
-- CREATE DATABASE knowledge_search;

-- Use the database
USE knowledge_search;

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  filename VARCHAR(255) NOT NULL,
  original_filename VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_size INT NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  content_text TEXT,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FULLTEXT INDEX idx_search (original_filename, content_text)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create document_categories junction table
CREATE TABLE IF NOT EXISTS document_categories (
  document_id VARCHAR(36),
  category_id INT,
  PRIMARY KEY (document_id, category_id),
  FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert predefined categories
INSERT IGNORE INTO categories (name) VALUES
  ('Marketing'),
  ('Sales'),
  ('Product'),
  ('Design'),
  ('Strategy'),
  ('Campaign'),
  ('Research'),
  ('Analytics'),
  ('Content'),
  ('Social Media');
