"use client";

// Mock-Daten für Client-Side (MySQL2 funktioniert nicht im Browser)
const mockCategories = [
  { id: 1, name: "IT-Support", description: "Professioneller IT-Support" },
  { id: 2, name: "Hardware", description: "PC-Bau und Hardware-Lösungen" },
  { id: 3, name: "Webdesign", description: "Webentwicklung und Design" },
  {
    id: 4,
    name: "KI-Lösungen",
    description: "KI-Assistenten und Automatisierung",
  },
  {
    id: 5,
    name: "Cloud-Services",
    description: "Cloud-Migration und -Services",
  },
  {
    id: 6,
    name: "Cybersecurity",
    description: "Sicherheitslösungen und -beratung",
  },
];

const mockProducts = [
  {
    id: 1,
    uuid: "550e8400-e29b-41d4-a716-446655440001",
    category_id: 1,
    name: "IT-Support – Remote 1h",
    description: "Direkter Remote-Support pro Stunde",
    short_description: "Professioneller IT-Support per Remote-Zugang",
    flow_type: "direct_buy" as const,
    price_model: "fixed" as const,
    base_price: 99,
    currency: "EUR",
    is_active: true,
    is_featured: true,
    sort_order: 1,
    category: mockCategories[0],
    variants: [],
  },
  {
    id: 2,
    uuid: "550e8400-e29b-41d4-a716-446655440002",
    category_id: 1,
    name: "IT-Support – Wartungsvertrag",
    description: "Monatliches Support-Paket für Firmen & Privat",
    short_description: "Umfassender IT-Support mit Wartungsvertrag",
    flow_type: "direct_buy" as const,
    price_model: "subscription" as const,
    base_price: 299,
    currency: "EUR",
    is_active: true,
    is_featured: true,
    sort_order: 2,
    category: mockCategories[0],
    variants: [],
  },
  {
    id: 3,
    uuid: "550e8400-e29b-41d4-a716-446655440003",
    category_id: 2,
    name: "PC-Bau – Gaming/Workstation",
    description: "Maßgeschneiderte PC-Konfiguration inkl. Beratung",
    short_description: "Individuelle PC-Lösungen für Gaming und Workstation",
    flow_type: "request_quote" as const,
    price_model: "custom" as const,
    base_price: null,
    currency: "EUR",
    is_active: true,
    is_featured: false,
    sort_order: 3,
    category: mockCategories[1],
    variants: [],
  },
  {
    id: 4,
    uuid: "550e8400-e29b-41d4-a716-446655440004",
    category_id: 3,
    name: "Webdesign – Starterpaket",
    description: "5 Seiten, CI-Design, SEO-Basics",
    short_description: "Komplettes Webdesign-Paket für den Start",
    flow_type: "request_quote" as const,
    price_model: "custom" as const,
    base_price: 2500,
    currency: "EUR",
    is_active: true,
    is_featured: true,
    sort_order: 4,
    category: mockCategories[2],
    variants: [],
  },
  {
    id: 5,
    uuid: "550e8400-e29b-41d4-a716-446655440005",
    category_id: 4,
    name: "KI-Assistent – Chatbot",
    description: "KI-Lösung für Kundenservice oder Automatisierung",
    short_description: "Intelligente Chatbot-Lösungen für Ihr Unternehmen",
    flow_type: "request_quote" as const,
    price_model: "custom" as const,
    base_price: null,
    currency: "EUR",
    is_active: true,
    is_featured: false,
    sort_order: 5,
    category: mockCategories[3],
    variants: [],
  },
  {
    id: 6,
    uuid: "550e8400-e29b-41d4-a716-446655440006",
    category_id: 5,
    name: "Cloud-Migration – M365 Paket",
    description: "Einrichtung & Umzug in Microsoft 365",
    short_description: "Professionelle Cloud-Migration zu Microsoft 365",
    flow_type: "request_quote" as const,
    price_model: "custom" as const,
    base_price: 1500,
    currency: "EUR",
    is_active: true,
    is_featured: false,
    sort_order: 6,
    category: mockCategories[4],
    variants: [],
  },
  {
    id: 7,
    uuid: "550e8400-e29b-41d4-a716-446655440007",
    category_id: 6,
    name: "Cybersecurity Check",
    description: "Sicherheits-Analyse inkl. Report & Empfehlung",
    short_description: "Umfassende Sicherheitsanalyse Ihres Systems",
    flow_type: "direct_buy" as const,
    price_model: "fixed" as const,
    base_price: 799,
    currency: "EUR",
    is_active: true,
    is_featured: true,
    sort_order: 7,
    category: mockCategories[5],
    variants: [],
  },
];

// Mock-Service für Client-Side
const MockShopService = {
  async getProducts(filters?: { category_id?: number; search?: string }) {
    let filteredProducts = [...mockProducts];

    if (filters?.category_id) {
      filteredProducts = filteredProducts.filter((p) => p.category_id === filters.category_id);
    }

    if (filters?.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredProducts = filteredProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm) ||
          p.description?.toLowerCase().includes(searchTerm) ||
          p.short_description?.toLowerCase().includes(searchTerm),
      );
    }

    return filteredProducts;
  },

  async getCategories() {
    return mockCategories;
  },

  async addToCart(sessionId: string, productId: number, variantId?: number | null) {
    // Mock-Warenkorb-Funktionalität
    console.log("Mock: Produkt zum Warenkorb hinzugefügt", {
      sessionId,
      productId,
      variantId,
    });
    return true;
  },
};

// Types für Client-Side
interface ShopCategory {
  id: number;
  name: string;
  description: string;
}

interface ShopProduct {
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
  category?: ShopCategory;
  variants: any[];
}
import { useEffect, useState } from "react";
import {
  FaCloud,
  FaCode,
  FaCog,
  FaDesktop,
  FaQuoteLeft,
  FaRobot,
  FaShieldAlt,
  FaShoppingCart,
} from "react-icons/fa";

// Icon-Mapping für Kategorien
const categoryIcons: Record<string, any> = {
  "IT-Support": FaCog,
  Hardware: FaDesktop,
  Webdesign: FaCode,
  "KI-Lösungen": FaRobot,
  "Cloud-Services": FaCloud,
  Cybersecurity: FaShieldAlt,
};

export default function ShopProductsPage() {
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [categories, setCategories] = useState<ShopCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productsData, categoriesData] = await Promise.all([
        MockShopService.getProducts(),
        MockShopService.getCategories(),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error("Fehler beim Laden der Produkte:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const filteredProducts = await MockShopService.getProducts({
        category_id: selectedCategory || undefined,
        search: searchTerm || undefined,
      });
      setProducts(filteredProducts);
    } catch (error) {
      console.error("Fehler bei der Suche:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product: ShopProduct) => {
    if (product.flow_type === "direct_buy") {
      // Zum Warenkorb hinzufügen
      const sessionId = `session_${Date.now()}`;
      try {
        const success = await MockShopService.addToCart(
          sessionId,
          product.id,
          product.variants?.[0]?.id || null,
        );

        if (success) {
          alert("Produkt wurde zum Warenkorb hinzugefügt!");
        } else {
          alert("Fehler beim Hinzufügen zum Warenkorb.");
        }
      } catch (error) {
        console.error("Warenkorb-Fehler:", error);
        alert("Fehler beim Hinzufügen zum Warenkorb.");
      }
    } else {
      // Zur Angebotsanfrage weiterleiten
      window.location.href = `/shop/quote-request/${product.uuid}`;
    }
  };

  const getPriceDisplay = (product: ShopProduct) => {
    if (product.price_model === "custom") {
      return "Preis auf Anfrage";
    }

    if (product.variants && product.variants.length > 0) {
      const defaultVariant = product.variants.find((v) => v.is_default) || product.variants[0];
      return `ab ${defaultVariant.price.toFixed(2)} €`;
    }

    if (product.base_price) {
      return `${product.base_price.toFixed(2)} €`;
    }

    return "Preis auf Anfrage";
  };

  const getCategoryIcon = (categoryName: string) => {
    const IconComponent = categoryIcons[categoryName] || FaCog;
    return <IconComponent className="h-6 w-6" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Lade Produkte...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Unsere Produkte & Services</h1>
          <p className="mt-2 text-gray-600">Professionelle IT-Lösungen für Ihr Unternehmen</p>
        </div>
      </div>

      {/* Filter und Suche */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Kategorie-Filter */}
            <select
              value={selectedCategory || ""}
              onChange={(e) =>
                setSelectedCategory(e.target.value ? parseInt(e.target.value) : null)
              }
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Alle Kategorien</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            {/* Suchfeld */}
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                placeholder="Produkte durchsuchen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
              <button
                onClick={handleSearch}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
              >
                Suchen
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Produktliste */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {products.length === 0 ? (
          <div className="text-center py-12">
            <FaCog className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Keine Produkte gefunden</h3>
            <p className="mt-1 text-sm text-gray-500">
              Versuchen Sie andere Suchbegriffe oder Filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Produktbild/Icon */}
                <div className="h-48 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <div className="text-white text-6xl">
                    {getCategoryIcon(product.category?.name || "")}
                  </div>
                </div>

                {/* Produktinfo */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-600">
                      {product.category?.name}
                    </span>
                    {product.is_featured && (
                      <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                        Empfohlen
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{product.name}</h3>

                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {product.short_description || product.description}
                  </p>

                  {/* Preis */}
                  <div className="mb-4">
                    <span className="text-2xl font-bold text-gray-900">
                      {getPriceDisplay(product)}
                    </span>
                    {product.price_model === "subscription" && (
                      <span className="text-sm text-gray-500 ml-1">/Monat</span>
                    )}
                  </div>

                  {/* Varianten */}
                  {product.variants && product.variants.length > 1 && (
                    <div className="mb-4">
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                        {product.variants.map((variant) => (
                          <option key={variant.id} value={variant.id}>
                            {variant.name} - {variant.price.toFixed(2)} €
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Aktion */}
                  <button
                    onClick={() => handleAddToCart(product)}
                    className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
                      product.flow_type === "direct_buy"
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-green-600 text-white hover:bg-green-700"
                    }`}
                  >
                    {product.flow_type === "direct_buy" ? (
                      <>
                        <FaShoppingCart className="inline mr-2" />
                        In den Warenkorb
                      </>
                    ) : (
                      <>
                        <FaQuoteLeft className="inline mr-2" />
                        Angebot anfordern
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
