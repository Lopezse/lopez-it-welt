-- =====================================================
-- LOPEZ IT WELT SHOP - PRODUKTE SYSTEM
-- =====================================================

-- Produktkategorien
CREATE TABLE IF NOT EXISTS lopez_shop_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Shop-Produkte
CREATE TABLE IF NOT EXISTS lopez_shop_products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    uuid VARCHAR(36) UNIQUE NOT NULL,
    category_id INT,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    flow_type ENUM('direct_buy', 'request_quote') NOT NULL,
    price_model ENUM('fixed', 'subscription', 'custom') NOT NULL,
    base_price DECIMAL(10,2) NULL,
    currency VARCHAR(3) DEFAULT 'EUR',
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    sort_order INT DEFAULT 0,
    meta_title VARCHAR(200),
    meta_description VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES lopez_shop_categories(id) ON DELETE SET NULL
);

-- Produktvarianten (für verschiedene Pakete)
CREATE TABLE IF NOT EXISTS lopez_shop_product_variants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'EUR',
    is_default BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES lopez_shop_products(id) ON DELETE CASCADE
);

-- Warenkorb
CREATE TABLE IF NOT EXISTS lopez_shop_cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id VARCHAR(100) NOT NULL,
    customer_id INT NULL,
    product_id INT NOT NULL,
    variant_id INT NULL,
    quantity INT DEFAULT 1,
    price DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'EUR',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES lopez_shop_products(id) ON DELETE CASCADE,
    FOREIGN KEY (variant_id) REFERENCES lopez_shop_product_variants(id) ON DELETE CASCADE,
    UNIQUE KEY unique_cart_item (session_id, product_id, variant_id)
);

-- Bestellungen (erweitert)
CREATE TABLE IF NOT EXISTS lopez_shop_orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    uuid VARCHAR(36) UNIQUE NOT NULL,
    customer_id INT NULL,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    status ENUM('pending', 'confirmed', 'processing', 'completed', 'cancelled', 'refunded') DEFAULT 'pending',
    payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
    payment_method VARCHAR(50),
    subtotal DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    shipping_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'EUR',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bestellpositionen
CREATE TABLE IF NOT EXISTS lopez_shop_order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    variant_id INT NULL,
    product_name VARCHAR(200) NOT NULL,
    product_description TEXT,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'EUR',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES lopez_shop_orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES lopez_shop_products(id) ON DELETE CASCADE,
    FOREIGN KEY (variant_id) REFERENCES lopez_shop_product_variants(id) ON DELETE SET NULL
);

-- Angebotsanfragen
CREATE TABLE IF NOT EXISTS lopez_shop_quote_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    uuid VARCHAR(36) UNIQUE NOT NULL,
    customer_id INT NULL,
    product_id INT NOT NULL,
    contact_name VARCHAR(200) NOT NULL,
    contact_email VARCHAR(200) NOT NULL,
    contact_phone VARCHAR(50),
    company VARCHAR(200),
    project_description TEXT NOT NULL,
    budget_range VARCHAR(100),
    timeline VARCHAR(100),
    status ENUM('new', 'in_review', 'quoted', 'accepted', 'rejected') DEFAULT 'new',
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES lopez_shop_products(id) ON DELETE CASCADE
);

-- Angebote
CREATE TABLE IF NOT EXISTS lopez_shop_quotes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    uuid VARCHAR(36) UNIQUE NOT NULL,
    quote_request_id INT NOT NULL,
    quote_number VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    total_amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'EUR',
    valid_until DATE,
    status ENUM('draft', 'sent', 'accepted', 'rejected', 'expired') DEFAULT 'draft',
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (quote_request_id) REFERENCES lopez_shop_quote_requests(id) ON DELETE CASCADE
);

-- Angebotspositionen
CREATE TABLE IF NOT EXISTS lopez_shop_quote_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quote_id INT NOT NULL,
    item_name VARCHAR(200) NOT NULL,
    item_description TEXT,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'EUR',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (quote_id) REFERENCES lopez_shop_quotes(id) ON DELETE CASCADE
);

-- Indizes für Performance
CREATE INDEX idx_products_category ON lopez_shop_products(category_id);
CREATE INDEX idx_products_active ON lopez_shop_products(is_active);
CREATE INDEX idx_products_featured ON lopez_shop_products(is_featured);
CREATE INDEX idx_cart_session ON lopez_shop_cart(session_id);
CREATE INDEX idx_cart_customer ON lopez_shop_cart(customer_id);
CREATE INDEX idx_orders_customer ON lopez_shop_orders(customer_id);
CREATE INDEX idx_orders_status ON lopez_shop_orders(status);
CREATE INDEX idx_quote_requests_customer ON lopez_shop_quote_requests(customer_id);
CREATE INDEX idx_quote_requests_status ON lopez_shop_quote_requests(status);
CREATE INDEX idx_quotes_request ON lopez_shop_quotes(quote_request_id);
CREATE INDEX idx_quotes_status ON lopez_shop_quotes(status);
