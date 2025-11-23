"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FaCog, FaFileInvoice, FaShieldAlt, FaShoppingCart, FaUser } from "react-icons/fa";

export default function ShopProfilePage() {
  const [user, setUser] = useState({
    id: "",
    email: "",
    first_name: "",
    last_name: "",
    company: "",
    phone: "",
    two_factor_enabled: false,
    two_factor_setup_completed: false,
  });

  useEffect(() => {
    // Demo-Benutzer laden (in Produktion aus API)
    setUser({
      id: "demo_customer_2",
      email: "test@example.com",
      first_name: "Test",
      last_name: "User",
      company: "Test GmbH",
      phone: "+49 123 456789",
      two_factor_enabled: false,
      two_factor_setup_completed: false,
    });
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8 rounded-t-lg">
          <div className="flex items-center">
            <div className="bg-white rounded-full p-3 mr-4">
              <FaUser className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {user.first_name} {user.last_name}
              </h1>
              <p className="text-blue-100">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Profil-Informationen */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FaUser className="mr-2 text-blue-600" />
                Profil-Informationen
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Name</label>
                  <p className="text-gray-900">
                    {user.first_name} {user.last_name}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">E-Mail</label>
                  <p className="text-gray-900">{user.email}</p>
                </div>
                {user.company && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Firma</label>
                    <p className="text-gray-900">{user.company}</p>
                  </div>
                )}
                {user.phone && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Telefon</label>
                    <p className="text-gray-900">{user.phone}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Sicherheit */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FaShieldAlt className="mr-2 text-blue-600" />
                Sicherheit
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Zwei-Faktor-Authentifizierung</p>
                    <p className="text-sm text-gray-500">
                      {user.two_factor_enabled ? "Aktiviert" : "Nicht aktiviert"}
                    </p>
                  </div>
                  <div className="flex items-center">
                    {user.two_factor_enabled ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <FaShieldAlt className="mr-1" />
                        Aktiv
                      </span>
                    ) : user.two_factor_setup_completed ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        <FaShieldAlt className="mr-1" />
                        Support erforderlich
                      </span>
                    ) : (
                      <Link
                        href="/shop/profile/2fa"
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                      >
                        Aktivieren
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Schnellzugriff */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Schnellzugriff</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/shop"
                className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <FaShoppingCart className="h-6 w-6 text-blue-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Shop</p>
                  <p className="text-sm text-gray-500">Produkte durchsuchen</p>
                </div>
              </Link>

              <Link
                href="/shop/orders"
                className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
              >
                <FaFileInvoice className="h-6 w-6 text-green-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Bestellungen</p>
                  <p className="text-sm text-gray-500">Meine Bestellungen</p>
                </div>
              </Link>

              <Link
                href="/shop/profile/settings"
                className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <FaCog className="h-6 w-6 text-gray-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Einstellungen</p>
                  <p className="text-sm text-gray-500">Profil bearbeiten</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
