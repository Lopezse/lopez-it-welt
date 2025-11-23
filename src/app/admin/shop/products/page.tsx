"use client";

import { useState } from "react";
import {
  FaCloud,
  FaCode,
  FaCog,
  FaDesktop,
  FaEdit,
  FaEye,
  FaPlus,
  FaRobot,
  FaSave,
  FaShieldAlt,
  FaStar,
  FaTimes,
  FaTrash,
} from "react-icons/fa";

// Mock-Daten für Admin-Verwaltung
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
    meta_title: "IT-Support Remote 1h - Lopez IT Welt",
    meta_description:
      "Professioneller IT-Support per Remote-Zugang. Schnell, kompetent, zuverlässig.",
    created_at: "2025-01-20T10:00:00Z",
    updated_at: "2025-01-20T10:00:00Z",
    category: mockCategories[0],
    variants: [],
  },
  // ... weitere Produkte
];

interface Product {
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
  category?: any;
  variants: any[];
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [categories, setCategories] = useState(mockCategories);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    description: "",
    short_description: "",
    category_id: 1,
    flow_type: "direct_buy",
    price_model: "fixed",
    base_price: 0,
    currency: "EUR",
    is_active: true,
    is_featured: false,
    sort_order: 0,
    meta_title: "",
    meta_description: "",
  });

  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      description: "",
      short_description: "",
      category_id: 1,
      flow_type: "direct_buy",
      price_model: "fixed",
      base_price: 0,
      currency: "EUR",
      is_active: true,
      is_featured: false,
      sort_order: 0,
      meta_title: "",
      meta_description: "",
    });
    setShowModal(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormData(product);
    setShowModal(true);
  };

  const handleSaveProduct = () => {
    if (editingProduct) {
      // Produkt bearbeiten
      setProducts(
        products.map((p) =>
          p.id === editingProduct.id
            ? { ...p, ...formData, updated_at: new Date().toISOString() }
            : p,
        ),
      );
    } else {
      // Neues Produkt hinzufügen
      const newProduct: Product = {
        id: Math.max(...products.map((p) => p.id)) + 1,
        uuid: `550e8400-e29b-41d4-a716-44665544000${Math.max(...products.map((p) => p.id)) + 1}`,
        ...formData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        category: categories.find((c) => c.id === formData.category_id),
        variants: [],
      } as Product;
      setProducts([...products, newProduct]);
    }
    setShowModal(false);
  };

  const handleDeleteProduct = (id: number) => {
    if (confirm("Produkt wirklich löschen?")) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  const getCategoryIcon = (categoryName: string) => {
    const icons: Record<string, any> = {
      "IT-Support": FaCog,
      Hardware: FaDesktop,
      Webdesign: FaCode,
      "KI-Lösungen": FaRobot,
      "Cloud-Services": FaCloud,
      Cybersecurity: FaShieldAlt,
    };
    const IconComponent = icons[categoryName] || FaCog;
    return <IconComponent className="h-5 w-5" />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Produktverwaltung</h1>
              <p className="mt-2 text-gray-600">Verwalten Sie Ihre Shop-Produkte und Services</p>
            </div>
            <button
              onClick={handleAddProduct}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <FaPlus className="mr-2" />
              Neues Produkt
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FaCog className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Gesamt Produkte</p>
                <p className="text-2xl font-bold text-gray-900">{products.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <FaEye className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Aktive Produkte</p>
                <p className="text-2xl font-bold text-gray-900">
                  {products.filter((p) => p.is_active).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <FaStar className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Empfohlene</p>
                <p className="text-2xl font-bold text-gray-900">
                  {products.filter((p) => p.is_featured).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FaCog className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Kategorien</p>
                <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Produkttabelle */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Alle Produkte</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produkt
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kategorie
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Preis
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aktionen
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            {getCategoryIcon(product.category?.name || "")}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.short_description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {product.category?.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.price_model === "custom"
                        ? "Auf Anfrage"
                        : `${product.base_price?.toFixed(2)} €`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        {product.is_active && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Aktiv
                          </span>
                        )}
                        {product.is_featured && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Empfohlen
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <FaEdit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FaTrash className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingProduct ? "Produkt bearbeiten" : "Neues Produkt"}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes className="h-6 w-6" />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSaveProduct();
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Produktname *
                    </label>
                    <input
                      type="text"
                      value={formData.name || ""}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kategorie *
                    </label>
                    <select
                      value={formData.category_id || 1}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          category_id: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kurzbeschreibung
                    </label>
                    <input
                      type="text"
                      value={formData.short_description || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          short_description: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Flow-Typ *
                    </label>
                    <select
                      value={formData.flow_type || "direct_buy"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          flow_type: e.target.value as "direct_buy" | "request_quote",
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="direct_buy">Direkt kaufen</option>
                      <option value="request_quote">Angebot anfordern</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Preis-Modell *
                    </label>
                    <select
                      value={formData.price_model || "fixed"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          price_model: e.target.value as "fixed" | "subscription" | "custom",
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="fixed">Fixpreis</option>
                      <option value="subscription">Abonnement</option>
                      <option value="custom">Auf Anfrage</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Grundpreis (€)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.base_price || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          base_price: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Währung</label>
                    <select
                      value={formData.currency || "EUR"}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="EUR">EUR</option>
                      <option value="USD">USD</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sortierreihenfolge
                    </label>
                    <input
                      type="number"
                      value={formData.sort_order || 0}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          sort_order: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Beschreibung
                  </label>
                  <textarea
                    value={formData.description || ""}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meta-Titel (SEO)
                  </label>
                  <input
                    type="text"
                    value={formData.meta_title || ""}
                    onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meta-Beschreibung (SEO)
                  </label>
                  <textarea
                    value={formData.meta_description || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        meta_description: e.target.value,
                      })
                    }
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="mt-6 flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.is_active || false}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          is_active: e.target.checked,
                        })
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Aktiv</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.is_featured || false}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          is_featured: e.target.checked,
                        })
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Empfohlen</span>
                  </label>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Abbrechen
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    <FaSave className="inline mr-2" />
                    Speichern
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
