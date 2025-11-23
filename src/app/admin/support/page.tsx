"use client";
import { Card } from "@/components/ui/Card";
import { FaArrowRight, FaBook, FaEnvelope, FaTicketAlt } from "react-icons/fa";

export default function SupportPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Support & Tickets</h1>
          <p className="text-gray-600">Verwalten Sie Support-Anfragen und Tickets</p>
        </div>
      </div>

      {/* Support-Karten */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tickets */}
        <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
              <FaTicketAlt className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Tickets</h3>
              <p className="text-sm text-gray-500">Support-Tickets verwalten</p>
            </div>
          </div>
          <p className="text-gray-600 mb-4">
            Verwalten Sie alle Support-Tickets und Kundenanfragen an einem zentralen Ort.
          </p>
          <a
            href="/admin/support/tickets"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            Tickets anzeigen
            <FaArrowRight className="w-4 h-4 ml-2" />
          </a>
        </Card>

        {/* Kontakt-Nachrichten */}
        <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
              <FaEnvelope className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Kontakt-Nachrichten</h3>
              <p className="text-sm text-gray-500">Kontaktformular-Nachrichten</p>
            </div>
          </div>
          <p className="text-gray-600 mb-4">
            Verwalten Sie eingehende Nachrichten aus dem Kontaktformular.
          </p>
          <a
            href="/admin/support/contact-messages"
            className="inline-flex items-center text-green-600 hover:text-green-800 font-medium"
          >
            Nachrichten anzeigen
            <FaArrowRight className="w-4 h-4 ml-2" />
          </a>
        </Card>

        {/* Wissensdatenbank */}
        <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
              <FaBook className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Wissensdatenbank</h3>
              <p className="text-sm text-gray-500">FAQ und Dokumentation</p>
            </div>
          </div>
          <p className="text-gray-600 mb-4">
            Verwalten Sie häufig gestellte Fragen und Support-Dokumentation.
          </p>
          <a
            href="/admin/support/knowledge"
            className="inline-flex items-center text-purple-600 hover:text-purple-800 font-medium"
          >
            Wissensdatenbank anzeigen
            <FaArrowRight className="w-4 h-4 ml-2" />
          </a>
        </Card>
      </div>

      {/* Schnellaktionen */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Schnellaktionen</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Neue Tickets</h4>
            <p className="text-sm text-blue-700 mb-3">Zeigt alle neuen Support-Tickets an</p>
            <a
              href="/admin/support/tickets?status=neu"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Neue Tickets anzeigen →
            </a>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <h4 className="font-medium text-green-900 mb-2">Kontakt-Nachrichten</h4>
            <p className="text-sm text-green-700 mb-3">Verwalten Sie Kontaktformular-Nachrichten</p>
            <a
              href="/admin/support/contact-messages?status=neu"
              className="text-green-600 hover:text-green-800 text-sm font-medium"
            >
              Neue Nachrichten anzeigen →
            </a>
          </div>
        </div>
      </Card>
    </div>
  );
}
