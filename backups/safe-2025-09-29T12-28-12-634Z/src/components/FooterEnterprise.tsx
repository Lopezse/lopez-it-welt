"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface FooterItem {
  id: string;
  section: string;
  title: string;
  content: string | null;
  link_url: string | null;
  language: string;
  sort_order: number;
}

interface FooterData {
  unternehmen: FooterItem[];
  leistungen: FooterItem[];
  kontakt: FooterItem[];
  rechtliches: FooterItem[];
}

export default function FooterEnterprise() {
  const [footerData, setFooterData] = useState<FooterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFooterData = async () => {
      try {
        const response = await fetch("/api/content/footer?language=de");
        if (!response.ok) {
          throw new Error("Footer-Daten konnten nicht geladen werden");
        }
        const data = await response.json();
        setFooterData(data);
      } catch (err) {
        console.error("Footer-Loading-Fehler:", err);
        setError("Footer-Daten nicht verfügbar");
      } finally {
        setLoading(false);
      }
    };

    loadFooterData();
  }, []);

  // Fallback: Minimal-Footer wenn DB nicht erreichbar
  if (loading) {
    return (
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <div className="animate-pulse">Footer wird geladen...</div>
        </div>
      </footer>
    );
  }

  if (error || !footerData) {
    return (
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold mb-2">
                <span className="text-yellow-400">Lopez</span> IT Welt
              </div>
              <div className="text-sm text-gray-400">
                © Lopez IT Welt – Alle Rechte vorbehalten
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-gray-900 text-white py-10 px-6 md:px-20">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Spalte 1: Logo + Markenname (fest im Code) */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              {/* Logo SVG */}
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">LW</span>
              </div>
              <div>
                <div className="text-xl font-bold">
                  <span className="text-yellow-400">Lopez</span> IT Welt
                </div>
                <div className="text-sm text-gray-400">Digitale Lösungen. Global. Sicher.</div>
              </div>
            </div>
          </div>

          {/* Spalte 2: Leistungen (aus DB) */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-yellow-400">Leistungen</h3>
            <ul className="space-y-2">
              {footerData.leistungen?.map((item) => (
                <li key={item.id}>
                  {item.link_url ? (
                    <Link
                      href={item.link_url}
                      className="text-gray-300 hover:text-yellow-400 transition-colors"
                    >
                      {item.title || item.content}
                    </Link>
                  ) : (
                    <span className="text-gray-300">{item.title || item.content}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Spalte 3: Kontakt (aus DB) */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-yellow-400">Kontakt</h3>
            <ul className="space-y-2">
              {footerData.kontakt?.map((item) => (
                <li key={item.id}>
                  {item.link_url ? (
                    <Link
                      href={item.link_url}
                      className="text-gray-300 hover:text-yellow-400 transition-colors"
                    >
                      {item.title || item.content}
                    </Link>
                  ) : (
                    <span className="text-gray-300">{item.title || item.content}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Spalte 4: Rechtliches (aus DB) */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-yellow-400">Rechtliches</h3>
            <ul className="space-y-2">
              {footerData.rechtliches?.map((item) => (
                <li key={item.id}>
                  {item.link_url ? (
                    <Link
                      href={item.link_url}
                      className="text-gray-300 hover:text-yellow-400 transition-colors"
                    >
                      {item.title || item.content}
                    </Link>
                  ) : (
                    <span className="text-gray-300">{item.title || item.content}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p className="text-gray-400 text-sm">© 2024 Lopez IT Welt. Alle Rechte vorbehalten.</p>
        </div>
      </div>
    </footer>
  );
}
