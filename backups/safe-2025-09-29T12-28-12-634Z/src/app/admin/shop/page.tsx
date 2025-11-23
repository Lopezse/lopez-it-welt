"use client";

import { FaArrowDown, FaArrowUp, FaBox, FaChartBar, FaShoppingCart, FaUsers } from "react-icons/fa";

export default function AdminShopDashboard() {
  // Mock-Daten für Dashboard
  const stats = [
    {
      name: "Gesamt Produkte",
      value: "7",
      change: "+2",
      changeType: "increase",
      icon: FaBox,
      color: "blue",
    },
    {
      name: "Aktive Bestellungen",
      value: "12",
      change: "+3",
      changeType: "increase",
      icon: FaShoppingCart,
      color: "green",
    },
    {
      name: "Registrierte Kunden",
      value: "45",
      change: "+8",
      changeType: "increase",
      icon: FaUsers,
      color: "purple",
    },
    {
      name: "Umsatz (Monat)",
      value: "€2,847",
      change: "+12%",
      changeType: "increase",
      icon: FaChartBar,
      color: "yellow",
    },
  ];

  const recentOrders = [
    {
      id: 1,
      customer: "Max Mustermann",
      product: "IT-Support – Remote 1h",
      amount: "€99",
      status: "Abgeschlossen",
    },
    {
      id: 2,
      customer: "Anna Schmidt",
      product: "Cybersecurity Check",
      amount: "€799",
      status: "In Bearbeitung",
    },
    {
      id: 3,
      customer: "Peter Weber",
      product: "Webdesign – Starterpaket",
      amount: "€2,500",
      status: "Angebot",
    },
  ];

  const topProducts = [
    { name: "IT-Support – Remote 1h", sales: 8, revenue: "€792" },
    { name: "Cybersecurity Check", sales: 3, revenue: "€2,397" },
    { name: "IT-Support – Wartungsvertrag", sales: 2, revenue: "€598" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Shop Dashboard</h1>
          <p className="mt-2 text-gray-600">Übersicht über Ihren E-Commerce Shop</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className={`p-2 rounded-lg bg-${stat.color}-100`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <div className="flex items-center mt-1">
                    {stat.changeType === "increase" ? (
                      <FaArrowUp className="h-3 w-3 text-green-500" />
                    ) : (
                      <FaArrowDown className="h-3 w-3 text-red-500" />
                    )}
                    <span
                      className={`text-sm ml-1 ${
                        stat.changeType === "increase" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {stat.change}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Letzte Bestellungen</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {recentOrders.map((order) => (
                <div key={order.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{order.customer}</p>
                      <p className="text-sm text-gray-500">{order.product}</p>
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
            <div className="px-6 py-3 bg-gray-50 text-center">
              <a
                href="/admin/shop/orders"
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Alle Bestellungen anzeigen
              </a>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Top Produkte</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {topProducts.map((product, index) => (
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
            <div className="px-6 py-3 bg-gray-50 text-center">
              <a
                href="/admin/shop/products"
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Alle Produkte anzeigen
              </a>
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
              <a
                href="/admin/shop/products"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FaBox className="h-6 w-6 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Produkt hinzufügen</p>
                  <p className="text-sm text-gray-500">Neues Produkt erstellen</p>
                </div>
              </a>
              <a
                href="/admin/shop/orders"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FaShoppingCart className="h-6 w-6 text-green-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Bestellungen verwalten</p>
                  <p className="text-sm text-gray-500">Bestellungen bearbeiten</p>
                </div>
              </a>
              <a
                href="/admin/shop/customers"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FaUsers className="h-6 w-6 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Kunden verwalten</p>
                  <p className="text-sm text-gray-500">Kundendaten bearbeiten</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
