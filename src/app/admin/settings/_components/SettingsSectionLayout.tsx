"use client";

import { ReactNode } from "react";

interface SettingsSectionLayoutProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}

export function SettingsSectionLayout({
  title,
  subtitle,
  children,
}: SettingsSectionLayoutProps) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#050509" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <header className="space-y-1">
            <h1 className="text-3xl font-bold" style={{ color: "#f4f4f4" }}>
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm" style={{ color: "#8a8a8a" }}>
                {subtitle}
              </p>
            )}
          </header>
          <div
            className="rounded-lg border p-6"
            style={{
              backgroundColor: "#111217",
              borderColor: "#272a33",
            }}
          >
            {children ?? (
              <p className="text-sm" style={{ color: "#b3b3b3" }}>
                Diese Einstellungsseite ist vorbereitet. Die fachliche Logik wird in einem
                nächsten Schritt implementiert (Enterprise++ Placeholder).
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

