// =====================================================
// LOPEZ IT WELT SHOP - PRODUKTE SERVICE
// =====================================================

import mysql from "mysql2/promise";

// Datenbank-Konfiguration
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "lopez_it_welt",
  port: parseInt(process.env.DB_PORT || "3306"),
};

// Typen
export interface ShopCategory {
  id: number;
  name: string;
  description: string | null;
  icon: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ShopProduct {
  id: number;
  uuid: string;
  category_id: number;
  name: string;
  description: string | null;
  short_description: string | null;
  flow_type: "direct_buy" | "request_quote";
  price_model: "fixed" | "subscription" | "custom";
  base_price: number | null;
  currency: string;
  is_active: boolean;
  is_featured: boolean;
  sort_order: number;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
  category?: ShopCategory;
  variants?: ShopProductVariant[];
}

export interface ShopProductVariant {
  id: number;
  product_id: number;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  is_default: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: number;
  session_id: string;
  customer_id: number | null;
  product_id: number;
  variant_id: number | null;
  quantity: number;
  price: number;
  currency: string;
  created_at: string;
  updated_at: string;
  product?: ShopProduct;
  variant?: ShopProductVariant;
}

export interface QuoteRequest {
  id: number;
  uuid: string;
  customer_id: number | null;
  product_id: number;
  contact_name: string;
  contact_email: string;
  contact_phone: string | null;
  company: string | null;
  project_description: string;
  budget_range: string | null;
  timeline: string | null;
  status: "new" | "in_review" | "quoted" | "accepted" | "rejected";
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
  product?: ShopProduct;
}

// Shop Products Service
export class ShopProductsService {
  // Kategorien abrufen
  static async getCategories(): Promise<ShopCategory[]> {
    const connection = await mysql.createConnection(dbConfig);
    try {
      const [rows] = await connection.execute(
        "SELECT * FROM lopez_shop_categories WHERE is_active = TRUE ORDER BY sort_order, name",
      );
      return rows as ShopCategory[];
    } finally {
      await connection.end();
    }
  }

  // Produkte abrufen
  static async getProducts(filters?: {
    category_id?: number;
    flow_type?: "direct_buy" | "request_quote";
    is_featured?: boolean;
    search?: string;
  }): Promise<ShopProduct[]> {
    const connection = await mysql.createConnection(dbConfig);
    try {
      let query = `
        SELECT p.*, c.name as category_name, c.description as category_description, c.icon as category_icon
        FROM lopez_shop_products p
        LEFT JOIN lopez_shop_categories c ON p.category_id = c.id
        WHERE p.is_active = TRUE
      `;
      const params: any[] = [];

      if (filters?.category_id) {
        query += " AND p.category_id = ?";
        params.push(filters.category_id);
      }

      if (filters?.flow_type) {
        query += " AND p.flow_type = ?";
        params.push(filters.flow_type);
      }

      if (filters?.is_featured) {
        query += " AND p.is_featured = TRUE";
      }

      if (filters?.search) {
        query += " AND (p.name LIKE ? OR p.description LIKE ? OR p.short_description LIKE ?)";
        const searchTerm = `%${filters.search}%`;
        params.push(searchTerm, searchTerm, searchTerm);
      }

      query += " ORDER BY p.is_featured DESC, p.sort_order, p.name";

      const [rows] = await connection.execute(query, params);
      const products = rows as any[];

      // Varianten für jedes Produkt laden
      for (const product of products) {
        const [variants] = await connection.execute(
          "SELECT * FROM lopez_shop_product_variants WHERE product_id = ? AND is_active = TRUE ORDER BY is_default DESC, name",
          [product.id],
        );
        product.variants = variants as ShopProductVariant[];
      }

      return products as ShopProduct[];
    } finally {
      await connection.end();
    }
  }

  // Einzelnes Produkt abrufen
  static async getProductById(id: number): Promise<ShopProduct | null> {
    const connection = await mysql.createConnection(dbConfig);
    try {
      const [rows] = await connection.execute(
        "SELECT * FROM lopez_shop_products WHERE id = ? AND is_active = TRUE",
        [id],
      );
      const products = rows as any[];
      if (products.length === 0) return null;

      const product = products[0] as ShopProduct;

      // Kategorie laden
      const [categoryRows] = await connection.execute(
        "SELECT * FROM lopez_shop_categories WHERE id = ?",
        [product.category_id],
      );
      product.category = (categoryRows as any[])[0] as ShopCategory;

      // Varianten laden
      const [variants] = await connection.execute(
        "SELECT * FROM lopez_shop_product_variants WHERE product_id = ? AND is_active = TRUE ORDER BY is_default DESC, name",
        [product.id],
      );
      product.variants = variants as ShopProductVariant[];

      return product;
    } finally {
      await connection.end();
    }
  }

  // Produkt nach UUID abrufen
  static async getProductByUuid(uuid: string): Promise<ShopProduct | null> {
    const connection = await mysql.createConnection(dbConfig);
    try {
      const [rows] = await connection.execute(
        "SELECT * FROM lopez_shop_products WHERE uuid = ? AND is_active = TRUE",
        [uuid],
      );
      const products = rows as any[];
      if (products.length === 0) return null;

      const product = products[0] as ShopProduct;

      // Kategorie laden
      const [categoryRows] = await connection.execute(
        "SELECT * FROM lopez_shop_categories WHERE id = ?",
        [product.category_id],
      );
      product.category = (categoryRows as any[])[0] as ShopCategory;

      // Varianten laden
      const [variants] = await connection.execute(
        "SELECT * FROM lopez_shop_product_variants WHERE product_id = ? AND is_active = TRUE ORDER BY is_default DESC, name",
        [product.id],
      );
      product.variants = variants as ShopProductVariant[];

      return product;
    } finally {
      await connection.end();
    }
  }

  // Warenkorb abrufen
  static async getCart(sessionId: string, customerId?: number): Promise<CartItem[]> {
    const connection = await mysql.createConnection(dbConfig);
    try {
      let query = `
        SELECT c.*, p.name as product_name, p.short_description as product_description, p.flow_type,
               v.name as variant_name, v.description as variant_description
        FROM lopez_shop_cart c
        LEFT JOIN lopez_shop_products p ON c.product_id = p.id
        LEFT JOIN lopez_shop_product_variants v ON c.variant_id = v.id
        WHERE c.session_id = ?
      `;
      const params: any[] = [sessionId];

      if (customerId) {
        query += " OR c.customer_id = ?";
        params.push(customerId);
      }

      query += " ORDER BY c.created_at DESC";

      const [rows] = await connection.execute(query, params);
      return rows as CartItem[];
    } finally {
      await connection.end();
    }
  }

  // Artikel zum Warenkorb hinzufügen
  static async addToCart(
    sessionId: string,
    productId: number,
    variantId: number | null,
    quantity: number = 1,
    customerId?: number,
  ): Promise<boolean> {
    const connection = await mysql.createConnection(dbConfig);
    try {
      // Produkt und Preis abrufen
      const [productRows] = await connection.execute(
        "SELECT base_price FROM lopez_shop_products WHERE id = ? AND is_active = TRUE",
        [productId],
      );
      const products = productRows as any[];
      if (products.length === 0) return false;

      let price = products[0].base_price;

      // Variantenpreis abrufen falls vorhanden
      if (variantId) {
        const [variantRows] = await connection.execute(
          "SELECT price FROM lopez_shop_product_variants WHERE id = ? AND is_active = TRUE",
          [variantId],
        );
        const variants = variantRows as any[];
        if (variants.length > 0) {
          price = variants[0].price;
        }
      }

      if (!price) return false;

      // Prüfen ob Artikel bereits im Warenkorb
      const [existingRows] = await connection.execute(
        "SELECT id, quantity FROM lopez_shop_cart WHERE session_id = ? AND product_id = ? AND variant_id = ?",
        [sessionId, productId, variantId],
      );
      const existing = existingRows as any[];

      if (existing.length > 0) {
        // Menge aktualisieren
        await connection.execute(
          "UPDATE lopez_shop_cart SET quantity = quantity + ?, customer_id = ? WHERE id = ?",
          [quantity, customerId || null, existing[0].id],
        );
      } else {
        // Neuen Artikel hinzufügen
        await connection.execute(
          "INSERT INTO lopez_shop_cart (session_id, customer_id, product_id, variant_id, quantity, price) VALUES (?, ?, ?, ?, ?, ?)",
          [sessionId, customerId || null, productId, variantId, quantity, price],
        );
      }

      return true;
    } finally {
      await connection.end();
    }
  }

  // Artikel aus Warenkorb entfernen
  static async removeFromCart(sessionId: string, cartItemId: number): Promise<boolean> {
    const connection = await mysql.createConnection(dbConfig);
    try {
      const [result] = await connection.execute(
        "DELETE FROM lopez_shop_cart WHERE id = ? AND session_id = ?",
        [cartItemId, sessionId],
      );
      return (result as any).affectedRows > 0;
    } finally {
      await connection.end();
    }
  }

  // Warenkorb leeren
  static async clearCart(sessionId: string): Promise<boolean> {
    const connection = await mysql.createConnection(dbConfig);
    try {
      await connection.execute("DELETE FROM lopez_shop_cart WHERE session_id = ?", [sessionId]);
      return true;
    } finally {
      await connection.end();
    }
  }

  // Angebotsanfrage erstellen
  static async createQuoteRequest(data: {
    productId: number;
    contactName: string;
    contactEmail: string;
    contactPhone?: string;
    company?: string;
    projectDescription: string;
    budgetRange?: string;
    timeline?: string;
    customerId?: number;
  }): Promise<string | null> {
    const connection = await mysql.createConnection(dbConfig);
    try {
      const uuid = `quote_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`;

      await connection.execute(
        `INSERT INTO lopez_shop_quote_requests 
         (uuid, customer_id, product_id, contact_name, contact_email, contact_phone, company, project_description, budget_range, timeline) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          uuid,
          data.customerId || null,
          data.productId,
          data.contactName,
          data.contactEmail,
          data.contactPhone || null,
          data.company || null,
          data.projectDescription,
          data.budgetRange || null,
          data.timeline || null,
        ],
      );

      return uuid;
    } finally {
      await connection.end();
    }
  }

  // Angebotsanfragen abrufen
  static async getQuoteRequests(customerId?: number): Promise<QuoteRequest[]> {
    const connection = await mysql.createConnection(dbConfig);
    try {
      let query = `
        SELECT qr.*, p.name as product_name, p.short_description as product_description
        FROM lopez_shop_quote_requests qr
        LEFT JOIN lopez_shop_products p ON qr.product_id = p.id
      `;
      const params: any[] = [];

      if (customerId) {
        query += " WHERE qr.customer_id = ?";
        params.push(customerId);
      }

      query += " ORDER BY qr.created_at DESC";

      const [rows] = await connection.execute(query, params);
      return rows as QuoteRequest[];
    } finally {
      await connection.end();
    }
  }
}
