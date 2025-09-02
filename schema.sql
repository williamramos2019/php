-- SADA MySQL Schema
CREATE DATABASE IF NOT EXISTS sada_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sada_db;

-- Users table
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Suppliers table (fornecedores)
CREATE TABLE suppliers (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    document VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE categories (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    description TEXT
);

-- Products table
CREATE TABLE products (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    code VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category_id VARCHAR(36),
    unit_price DECIMAL(10,2) NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    min_stock INT NOT NULL DEFAULT 0,
    is_rentable BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Rentals table
CREATE TABLE rentals (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    supplier_id VARCHAR(36) NOT NULL,
    equipment_name VARCHAR(255) NOT NULL,
    equipment_type VARCHAR(255),
    quantity INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    rental_period VARCHAR(20) NOT NULL DEFAULT 'daily',
    daily_rate DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE CASCADE
);

-- Inventory movements table
CREATE TABLE inventory_movements (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    product_id VARCHAR(36) NOT NULL,
    type VARCHAR(20) NOT NULL,
    quantity INT NOT NULL,
    reason VARCHAR(255) NOT NULL,
    notes TEXT,
    user_id VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Equipment substitutions table
CREATE TABLE equipment_substitutions (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    rental_id VARCHAR(36) NOT NULL,
    original_equipment_name VARCHAR(255) NOT NULL,
    new_equipment_name VARCHAR(255) NOT NULL,
    reason TEXT NOT NULL,
    substitution_date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (rental_id) REFERENCES rentals(id) ON DELETE CASCADE
);

-- Insert sample data
INSERT INTO categories (id, name, description) VALUES 
('cat-tools', 'Ferramentas', 'Ferramentas e equipamentos diversos'),
('cat-fixing', 'Fixação', 'Parafusos, porcas e materiais de fixação');

INSERT INTO suppliers (id, name, email, phone, address, document) VALUES
('supp-001', 'Locadora ABC Equipamentos', 'contato@locadoraabc.com', '(11) 3333-4444', 'Av. Industrial, 500', '12.345.678/0001-90');

INSERT INTO products (id, code, name, description, category_id, unit_price, quantity, min_stock, is_rentable) VALUES
('prod-drill', 'FI-001', 'Furadeira Industrial', 'Makita 18V', 'cat-tools', 450.00, 15, 5, TRUE),
('prod-screws', 'PF-M8-001', 'Parafusos M8', 'Aço Inox 30mm', 'cat-fixing', 2.50, 12, 50, FALSE);

INSERT INTO rentals (id, supplier_id, equipment_name, equipment_type, quantity, start_date, end_date, rental_period, daily_rate, total_amount, status, notes) VALUES
('rent-001', 'supp-001', 'Escavadeira Hidráulica', 'Máquina Pesada', 1, '2024-01-15', '2024-01-20', 'daily', 350.00, 1750.00, 'active', 'Para obra de terraplanagem');