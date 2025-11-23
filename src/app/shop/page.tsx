"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FaAward,
  FaBox,
  FaChartLine,
  FaCheckCircle,
  FaClock,
  FaCode,
  FaCog,
  FaDesktop,
  FaGlobe,
  FaHeadset,
  FaLock,
  FaQuoteLeft,
  FaShieldAlt,
  FaShoppingCart,
  FaSignOutAlt,
  FaUsers,
} from "react-icons/fa";

// Mock-Daten für Shop-Dashboard
const mockStats = {
  totalProducts: 7,
  activeOrders: 12,
  totalCustomers: 45,
  monthlyRevenue: 2847,
};

const mockRecentOrders = [
  {
    id: 1,
    customer: "Max Mustermann",
    product: "IT-Support – Remote 1h",
    amount: "€99",
    status: "Abgeschlossen",
    date: "2025-01-20",
  },
  {
    id: 2,
    customer: "Anna Schmidt",
    product: "Cybersecurity Check",
    amount: "€799",
    status: "In Bearbeitung",
    date: "2025-01-19",
  },
  {
    id: 3,
    customer: "Peter Weber",
    product: "Webdesign – Starterpaket",
    amount: "€2,500",
    status: "Angebot",
    date: "2025-01-18",
  },
];

const mockTopProducts = [
  { name: "IT-Support – Remote 1h", sales: 8, revenue: "€792" },
  { name: "Cybersecurity Check", sales: 3, revenue: "€2,397" },
  { name: "IT-Support – Wartungsvertrag", sales: 2, revenue: "€598" },
];

// Featured Products für Enterprise++ Startseite
const featuredProducts = [
  {
    id: 1,
    name: "IT-Support – Remote 1h",
    description: "Professioneller IT-Support per Remote-Zugang. Schnell, kompetent, zuverlässig.",
    price: "99 €",
    category: "IT-Support",
    icon: FaCog,
    badge: "Empfohlen",
    badgeColor: "bg-yellow-100 text-yellow-800",
    flow: "direct_buy",
  },
  {
    id: 2,
    name: "Cybersecurity Check",
    description: "Sicherheits-Analyse inkl. Report & Empfehlung. DSGVO-konform, ISO 27001 Ready.",
    price: "799 €",
    category: "Cybersecurity",
    icon: FaShieldAlt,
    badge: "Sicherheitscheck",
    badgeColor: "bg-red-100 text-red-800",
    flow: "direct_buy",
  },
  {
    id: 3,
    name: "Webdesign – Starterpaket",
    description: "5 Seiten, CI-Design, SEO-Basics. Professionelle Webpräsenz für Ihr Unternehmen.",
    price: "ab 2.500 €",
    category: "Webdesign",
    icon: FaCode,
    badge: "Neu",
    badgeColor: "bg-blue-100 text-blue-800",
    flow: "request_quote",
  },
];

export default function ShopPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState("de");

  useEffect(() => {
    // Simuliere Login-Check
    const token = localStorage.getItem("token");
    if (token) {
      // Mock-User für Demo
      setUser({
        id: 1,
        name: "Max Mustermann",
        email: "max@example.com",
        role: "customer",
      });
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Lade Shop...</p>
        </div>
      </div>
    );
  }

  // Wenn Benutzer angemeldet ist, zeige Dashboard
  if (user) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <FaCog className="h-8 w-8 text-blue-600 mr-3" />
                <h1 className="text-2xl font-bold text-gray-900">Lopez IT Welt Shop</h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">Willkommen, {user.name}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-3 py-2 text-sm text-gray-700 hover:text-gray-900"
                >
                  <FaSignOutAlt className="mr-2" />
                  Abmelden
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FaBox className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Gesamt Produkte</p>
                  <p className="text-2xl font-bold text-gray-900">{mockStats.totalProducts}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FaShoppingCart className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Aktive Bestellungen</p>
                  <p className="text-2xl font-bold text-gray-900">{mockStats.activeOrders}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FaUsers className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Kunden</p>
                  <p className="text-2xl font-bold text-gray-900">{mockStats.totalCustomers}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <FaChartLine className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Umsatz (Monat)</p>
                  <p className="text-2xl font-bold text-gray-900">€{mockStats.monthlyRevenue}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Orders */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Letzte Bestellungen</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {mockRecentOrders.map((order) => (
                  <div key={order.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{order.customer}</p>
                        <p className="text-sm text-gray-500">{order.product}</p>
                        <p className="text-xs text-gray-400">{order.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{order.amount}</p>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            order.status === "Abgeschlossen"
                              ? "bg-green-100 text-green-800"
                              : order.status === "In Bearbeitung"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Top Produkte</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {mockTopProducts.map((product, index) => (
                  <div key={product.name} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-500 mr-3">#{index + 1}</span>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-500">{product.sales} Verkäufe</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{product.revenue}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Schnellaktionen</h3>
            </div>
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                  href="/shop/products"
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <FaBox className="h-6 w-6 text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Produkte durchsuchen</p>
                    <p className="text-sm text-gray-500">Alle Services anzeigen</p>
                  </div>
                </Link>
                <Link
                  href="/shop/quote-request"
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <FaQuoteLeft className="h-6 w-6 text-green-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Angebot anfordern</p>
                    <p className="text-sm text-gray-500">Individuelle Beratung</p>
                  </div>
                </Link>
                <Link
                  href="/admin/shop/products"
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <FaCog className="h-6 w-6 text-purple-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Produkte verwalten</p>
                    <p className="text-sm text-gray-500">Admin-Bereich</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Enterprise++ Shop Landing Page (ohne eigenen Header - wird vom Layout bereitgestellt)
  return (
    <div>
      {/* Hero Section - Enterprise++ Style */}
      <div className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Willkommen bei
              <br />
              <span className="text-yellow-400">Lopez IT Welt</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Ihr Partner für professionelle IT-Lösungen & Services mit Fokus auf Barrierefreiheit,
              Sicherheit und Mehrsprachigkeit
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href="/shop/products"
                className="inline-flex items-center px-8 py-4 bg-yellow-400 text-blue-900 font-bold text-lg rounded-lg hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <FaBox className="mr-3" />
                Produkte entdecken
              </Link>
              <Link
                href="/shop/quote-request"
                className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-bold text-lg rounded-lg hover:bg-white hover:text-blue-900 transition-all duration-300 transform hover:scale-105"
              >
                <FaQuoteLeft className="mr-3" />
                Individuelle Anfrage
              </Link>
            </div>

            {/* Trust Elements */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm">
              <div className="flex items-center">
                <FaCheckCircle className="h-5 w-5 text-green-400 mr-2" />
                <span>DSGVO-konform</span>
              </div>
              <div className="flex items-center">
                <FaAward className="h-5 w-5 text-yellow-400 mr-2" />
                <span>ISO 27001 Ready</span>
              </div>
              <div className="flex items-center">
                <FaHeadset className="h-5 w-5 text-blue-300 mr-2" />
                <span>24/7 Support</span>
              </div>
              <div className="flex items-center">
                <FaLock className="h-5 w-5 text-red-400 mr-2" />
                <span>Enterprise Security</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Unsere Top-Services</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Professionelle IT-Dienstleistungen für Unternehmen jeder Größe - von der Beratung bis
            zur Umsetzung
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredProducts.map((product) => {
            const IconComponent = product.icon;
            return (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
              >
                <div className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <IconComponent className="h-8 w-8 text-blue-600" />
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${product.badgeColor}`}
                    >
                      {product.badge}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{product.name}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-blue-600">{product.price}</span>
                    {product.flow === "direct_buy" ? (
                      <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                        In den Warenkorb
                      </button>
                    ) : (
                      <button className="px-6 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors font-semibold">
                        Angebot anfordern
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trust & Features Section */}
      <div className="bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Warum Lopez IT Welt?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Enterprise++ Standards für maximale Sicherheit, Barrierefreiheit und Performance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center bg-white p-8 rounded-xl shadow-lg">
              <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <FaShieldAlt className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Enterprise Security</h3>
              <p className="text-gray-600 leading-relaxed">
                DSGVO-konform, ISO 27001 Ready, 24/7 Monitoring
              </p>
            </div>
            <div className="text-center bg-white p-8 rounded-xl shadow-lg">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <FaDesktop className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Barrierefreiheit</h3>
              <p className="text-gray-600 leading-relaxed">
                WCAG 2.1 konform, inklusive IT-Lösungen
              </p>
            </div>
            <div className="text-center bg-white p-8 rounded-xl shadow-lg">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <FaGlobe className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Mehrsprachigkeit</h3>
              <p className="text-gray-600 leading-relaxed">
                Deutsch, Englisch, Spanisch - global einsatzbereit
              </p>
            </div>
            <div className="text-center bg-white p-8 rounded-xl shadow-lg">
              <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <FaClock className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">24/7 Support</h3>
              <p className="text-gray-600 leading-relaxed">
                Rund-um-die-Uhr Betreuung für kritische Systeme
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-6">Bereit für Ihre Enterprise IT-Lösung?</h2>
            <p className="text-xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Entdecken Sie unsere Services oder fordern Sie ein individuelles Angebot an. Wir
              beraten Sie gerne bei der optimalen IT-Strategie für Ihr Unternehmen.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/shop/products"
                className="inline-flex items-center px-8 py-4 bg-yellow-400 text-blue-900 font-bold text-lg rounded-lg hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <FaBox className="mr-3" />
                Alle Produkte anzeigen
              </Link>
              <Link
                href="/shop/quote-request"
                className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-bold text-lg rounded-lg hover:bg-white hover:text-blue-900 transition-all duration-300 transform hover:scale-105"
              >
                <FaQuoteLeft className="mr-3" />
                Kostenlose Beratung
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
