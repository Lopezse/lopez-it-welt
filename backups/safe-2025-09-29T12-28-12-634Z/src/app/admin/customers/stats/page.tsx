"use client";

import Link from "next/link";
import { FaArrowLeft, FaBuilding, FaChartLine, FaUser, FaUsers, FaUserTie } from "react-icons/fa";

export default function CustomerStatsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="px-6 py-4">
          <div className="flex items-center">
            <Link href="/admin/customers" className="mr-4 p-2 text-gray-400 hover:text-gray-600">
              <FaArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <FaChartLine className="mr-3 text-blue-600" />
                Kunden-Statistiken
              </h1>
              <p className="text-gray-600 mt-1">Analytics & Performance-Metriken</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FaUsers className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Gesamt Kunden</p>
                <p className="text-2xl font-semibold text-gray-900">1,247</p>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FaUser className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Neue Kunden (Monat)</p>
                <p className="text-2xl font-semibold text-gray-900">+89</p>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FaBuilding className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Aktive Kunden</p>
                <p className="text-2xl font-semibold text-gray-900">1,156</p>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FaUserTie className="h-8 w-8 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Wachstumsrate</p>
                <p className="text-2xl font-semibold text-gray-900">+2.3%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Customer Type Distribution */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Kunden nach Typ</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full mr-3 bg-blue-500"></div>
                  <FaUser className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm font-medium text-gray-900">Privat</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-gray-900">892</span>
                  <span className="text-xs text-gray-500 ml-2">(71.5%)</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full mr-3 bg-green-500"></div>
                  <FaBuilding className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm font-medium text-gray-900">Firma</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-gray-900">298</span>
                  <span className="text-xs text-gray-500 ml-2">(23.9%)</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full mr-3 bg-purple-500"></div>
                  <FaUserTie className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm font-medium text-gray-900">Behörde</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-gray-900">45</span>
                  <span className="text-xs text-gray-500 ml-2">(3.6%)</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full mr-3 bg-orange-500"></div>
                  <FaUsers className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm font-medium text-gray-900">Partner</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-gray-900">12</span>
                  <span className="text-xs text-gray-500 ml-2">(1.0%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Support Level Distribution */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Support-Level</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full mr-3 bg-gray-500"></div>
                  <span className="text-sm font-medium text-gray-900">Standard</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-gray-900">856</span>
                  <span className="text-xs text-gray-500 ml-2">(68.6%)</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full mr-3 bg-blue-500"></div>
                  <span className="text-sm font-medium text-gray-900">Premium</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-gray-900">234</span>
                  <span className="text-xs text-gray-500 ml-2">(18.8%)</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full mr-3 bg-orange-500"></div>
                  <span className="text-sm font-medium text-gray-900">SLA 24h</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-gray-900">123</span>
                  <span className="text-xs text-gray-500 ml-2">(9.9%)</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full mr-3 bg-red-500"></div>
                  <span className="text-sm font-medium text-gray-900">SLA 4h</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-gray-900">34</span>
                  <span className="text-xs text-gray-500 ml-2">(2.7%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Message */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <FaChartLine className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Statistiken-Dashboard</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>Diese Seite zeigt eine Übersicht der wichtigsten Kunden-Metriken.</p>
                <p className="mt-1">
                  Für detaillierte Analysen und Export-Funktionen wird die Seite kontinuierlich
                  erweitert.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
