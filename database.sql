-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS kirs_employee_system;

-- Use the database
USE kirs_employee_system;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('super_admin', 'admin', 'assistant_admin', 'user') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create employees table
CREATE TABLE IF NOT EXISTS employees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  surname VARCHAR(50) NOT NULL,
  other_name VARCHAR(50),
  rank VARCHAR(100) NOT NULL,
  psn_number VARCHAR(50) NOT NULL UNIQUE,
  phone_number VARCHAR(20) NOT NULL UNIQUE,
  picture VARCHAR(255) NOT NULL,
  qr_code VARCHAR(255) NOT NULL,
  registered_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (registered_by) REFERENCES users(id)
);

-- Insert initial super admin user (password: admin123)
-- The password will be hashed in the application code
INSERT INTO users (username, password, role) VALUES 
('super@kirs', '$2a$10$JwZPRMQNsN5/z3XZv5XB8.TnSBHtZKGV.Wc.eLQH3QGxj8WvHW3Hy', 'super_admin');
