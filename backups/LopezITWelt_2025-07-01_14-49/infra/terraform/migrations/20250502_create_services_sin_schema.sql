-- Migration: Create Services & SIN Schema
-- Author: Ramiro Lopez Mc Lean
-- Date: 2024-05-02
-- Description: Creates the initial schema for services, categories and SIN entries

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create categories table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    code VARCHAR(3) NOT NULL,
    short_code VARCHAR(3),
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT categories_code_unique UNIQUE (code)
);

-- Create services table
CREATE TABLE services (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    category_id INTEGER NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT services_category_id_fk 
        FOREIGN KEY (category_id) 
        REFERENCES categories(id) 
        ON DELETE RESTRICT
);

-- Create sin_entries table
CREATE TABLE sin_entries (
    id SERIAL PRIMARY KEY,
    sin VARCHAR(12) NOT NULL,
    service_id INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT sin_entries_sin_unique UNIQUE (sin),
    CONSTRAINT sin_entries_service_id_fk 
        FOREIGN KEY (service_id) 
        REFERENCES services(id) 
        ON DELETE RESTRICT
);

-- Create indexes
CREATE INDEX idx_services_category_id ON services(category_id);
CREATE INDEX idx_sin_entries_service_id ON sin_entries(service_id);
CREATE INDEX idx_sin_entries_created_at ON sin_entries(created_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at
    BEFORE UPDATE ON services
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sin_entries_updated_at
    BEFORE UPDATE ON sin_entries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert some initial categories
INSERT INTO categories (code, short_code, name) VALUES
    ('MIS', 'MS', 'Managed IT Services'),
    ('CLD', 'CL', 'Cloud Consulting'),
    ('SEC', 'SC', 'Security Services'),
    ('NET', 'NT', 'Networking'),
    ('HWD', 'HW', 'Hardware & Support');

-- Create rollback function
CREATE OR REPLACE FUNCTION rollback_services_sin_schema()
RETURNS void AS $$
BEGIN
    DROP TABLE IF EXISTS sin_entries;
    DROP TABLE IF EXISTS services;
    DROP TABLE IF EXISTS categories;
    DROP FUNCTION IF EXISTS update_updated_at_column();
END;
$$ LANGUAGE plpgsql; 