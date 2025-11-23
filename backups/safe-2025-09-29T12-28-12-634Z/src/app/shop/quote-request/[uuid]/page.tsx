"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  FaQuoteLeft,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaBuilding,
  FaFileAlt,
  FaEuro,
  FaCalendar,
} from "react-icons/fa";
import { ShopProductsService, ShopProduct } from "@/lib/shop-products-service";

export default function QuoteRequestPage() {
  const params = useParams();
  const productUuid = params.uuid as string;

  const [product, setProduct] = useState<ShopProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Formular-Daten
  const [formData, setFormData] = useState({
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    company: "",
    projectDescription: "",
    budgetRange: "",
    timeline: "",
  });

  useEffect(() => {
    if (productUuid) {
      loadProduct();
    }
  }, [productUuid]);

  const loadProduct = async () => {
    try {
      const productData = await ShopProductsService.getProductByUuid(productUuid);
      setProduct(productData);
    } catch (error) {
      console.error("Fehler beim Laden des Produkts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    setSubmitting(true);
    try {
      const uuid = await ShopProductsService.createQuoteRequest({
        productId: product.id,
        contactName: formData.contactName,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        company: formData.company,
        projectDescription: formData.projectDescription,
        budgetRange: formData.budgetRange,
        timeline: formData.timeline,
      });

      if (uuid) {
        setSuccess(true);
      } else {
        alert("Fehler beim Erstellen der Anfrage. Bitte versuchen Sie es erneut.");
      }
    } catch (error) {
      console.error("Fehler beim Erstellen der Anfrage:", error);
      alert("Fehler beim Erstellen der Anfrage. Bitte versuchen Sie es erneut.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Lade Produkt...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Produkt nicht gefunden</h1>
          <p className="text-gray-600 mb-6">
            Das angeforderte Produkt konnte nicht gefunden werden.
          </p>
          <a href="/shop/products" className="text-blue-600 hover:text-blue-700">
            Zurück zu den Produkten
          </a>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <FaQuoteLeft className="text-green-600 text-2xl" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Anfrage erfolgreich gesendet!</h1>
          <p className="text-gray-600 mb-6">
            Vielen Dank für Ihr Interesse an "{product.name}". Wir werden uns innerhalb von 24
            Stunden bei Ihnen melden.
          </p>
          <div className="space-y-2">
            <a
              href="/shop/products"
              className="block w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              Weitere Produkte ansehen
            </a>
            <a
              href="/shop"
              className="block w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700"
            >
              Zurück zum Dashboard
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Angebot anfordern</h1>
          <p className="mt-2 text-gray-600">
            Füllen Sie das Formular aus, um ein individuelles Angebot zu erhalten.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Produktinfo */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{product.name}</h2>
              <p className="text-gray-600 mb-4">{product.description}</p>
              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex items-center">
                  <FaFileAlt className="mr-2" />
                  <span>Individuelles Angebot</span>
                </div>
                <div className="flex items-center">
                  <FaCalendar className="mr-2" />
                  <span>Beratung inklusive</span>
                </div>
              </div>
            </div>
          </div>

          {/* Formular */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Kontaktinformationen</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaUser className="inline mr-2" />
                    Name *
                  </label>
                  <input
                    type="text"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ihr vollständiger Name"
                  />
                </div>

                {/* E-Mail */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaEnvelope className="inline mr-2" />
                    E-Mail *
                  </label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="ihre@email.de"
                  />
                </div>

                {/* Telefon */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaPhone className="inline mr-2" />
                    Telefon
                  </label>
                  <input
                    type="tel"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+49 123 456789"
                  />
                </div>

                {/* Unternehmen */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaBuilding className="inline mr-2" />
                    Unternehmen
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ihr Unternehmen"
                  />
                </div>
              </div>

              {/* Projektbeschreibung */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaFileAlt className="inline mr-2" />
                  Projektbeschreibung *
                </label>
                <textarea
                  name="projectDescription"
                  value={formData.projectDescription}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Beschreiben Sie Ihr Projekt so detailliert wie möglich..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Budget */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaEuro className="inline mr-2" />
                    Budget-Rahmen
                  </label>
                  <select
                    name="budgetRange"
                    value={formData.budgetRange}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Bitte wählen...</option>
                    <option value="unter-1000">Unter 1.000 €</option>
                    <option value="1000-5000">1.000 - 5.000 €</option>
                    <option value="5000-10000">5.000 - 10.000 €</option>
                    <option value="10000-25000">10.000 - 25.000 €</option>
                    <option value="25000-50000">25.000 - 50.000 €</option>
                    <option value="ueber-50000">Über 50.000 €</option>
                  </select>
                </div>

                {/* Timeline */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaCalendar className="inline mr-2" />
                    Gewünschter Start
                  </label>
                  <select
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Bitte wählen...</option>
                    <option value="sofort">Sofort</option>
                    <option value="1-monat">Innerhalb 1 Monat</option>
                    <option value="3-monate">Innerhalb 3 Monate</option>
                    <option value="6-monate">Innerhalb 6 Monate</option>
                    <option value="flexibel">Flexibel</option>
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white inline-block mr-2"></div>
                      Wird gesendet...
                    </>
                  ) : (
                    <>
                      <FaQuoteLeft className="inline mr-2" />
                      Angebot anfordern
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
