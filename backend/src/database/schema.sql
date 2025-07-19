-- Create database
CREATE DATABASE IF NOT EXISTS evaluation_system;
USE evaluation_system;

-- Create subjects table
CREATE TABLE subjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create competencies table
CREATE TABLE competencies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    subject_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    marks DECIMAL(4,2) NOT NULL CHECK (marks >= 0 AND marks <= 10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    UNIQUE KEY unique_competency_per_subject (subject_id, name)
);

-- Insert sample data
INSERT INTO subjects (name, description) VALUES 
('Data Structures', 'Fundamental data structures and algorithms'),
('Cloud Computing', 'Cloud technologies and services'),
('Networking', 'Computer networking concepts and protocols'),
('Signal Processing', 'Digital signal processing techniques');

INSERT INTO competencies (subject_id, name, marks) VALUES 
(1, 'Arrays', 7.0),
(1, 'Linked Lists', 8.0),
(1, 'Trees', 9.0),
(1, 'Graphs', 9.5),
(2, 'AWS Services', 8.5),
(2, 'Docker', 7.5),
(2, 'Kubernetes', 9.0);