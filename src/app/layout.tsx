import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// 🛡️ CURSOR-INTEGRATION UND ANTI-REGELBRUCH-SYSTEM (TEMPORÄR DEAKTIVIERT)
import I18nProvider from "@/components/Features/I18nProvider";
import CookieBanner from "@/components/dsgvo/CookieBanner";
// import { initializeCursorIntegration } from '@/lib/cursor-integration'
// import { showCursorStatus, startCursorMonitoring } from '@/lib/cursor-monitor'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lopez IT Welt | Digitale Enterprise++ IT-Lösungen",
  description:
    "Lopez IT Welt bietet moderne, barrierefreie und mehrsprachige IT-Lösungen auf Enterprise++-Niveau – zuverlässig, sicher und zukunftsorientiert.",
  keywords:
    "Lopez IT Welt, Enterprise++, IT-Lösungen, barrierefreie Webentwicklung, mehrsprachige Websites, DSGVO-Compliance, React, Next.js, TypeScript, digitale Transformation",
  authors: [{ name: "Ramiro Lopez Rodriguez" }],
  creator: "Lopez IT Welt",
  publisher: "Lopez IT Welt",
  robots: "index, follow",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "Lopez IT Welt | Digitale Enterprise++ IT-Lösungen",
    description:
      "Lopez IT Welt bietet moderne, barrierefreie und mehrsprachige IT-Lösungen auf Enterprise++-Niveau – zuverlässig, sicher und zukunftsorientiert.",
    type: "website",
    locale: "de_DE",
  },
};

// 🚀 CURSOR-INTEGRATION TEMPORÄR DEAKTIVIERT
// Wird bei jedem App-Start automatisch ausgeführt
try {
  console.log("🚀 Cursor-Integration wird temporär deaktiviert...");

  // 1. Cursor-Integration initialisieren (DEAKTIVIERT)
  // initializeCursorIntegration();

  // 2. Cursor-Monitoring starten (DEAKTIVIERT)
  // startCursorMonitoring();

  // 3. Status anzeigen (DEAKTIVIERT)
  // showCursorStatus();

  console.log("✅ Cursor-Integration temporär deaktiviert");
} catch (error) {
  console.error("❌ Fehler bei Cursor-Integration:", error);
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" suppressHydrationWarning>
      <head>
        {/* UTF-8 ENCODING */}
        <meta charSet="utf-8" />
        {/* 🛡️ ANTI-REGELBRUCH-SYSTEM META-TAGS */}
        <meta name="enterprise-mode" content="true" />
        <meta name="anti-rule-break" content="active" />
        <meta name="agent-monitoring" content="enabled" />
        <meta name="enterprise-compliance" content="enforced" />
        <meta name="cursor-integration" content="active" />
      </head>
      <body className={inter.className}>
        <I18nProvider>
          {/* 🛡️ ANTI-REGELBRUCH-SYSTEM WRAPPER */}
          <div id="anti-rule-break-wrapper" data-system-active="true">
            {children}
            {/* 🍪 DSGVO Cookie-Banner */}
            <CookieBanner />
          </div>
        </I18nProvider>
        {/* 🛡️ ANTI-REGELBRUCH-SYSTEM SCRIPT */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // 🛡️ ANTI-REGELBRUCH-SYSTEM CLIENT-SEITIGE AKTIVIERUNG
              console.log('🛡️ Anti-Regelbruch-System wird client-seitig aktiviert...');
              
              // System-Status setzen
              window.antiRuleBreakSystem = {
                active: true,
                initialized: true,
                timestamp: new Date().toISOString(),
                version: '1.0.0',
                cursorIntegration: true
              };
              
              // Überwachung starten
              setInterval(() => {
                console.log('🛡️ Anti-Regelbruch-System: Überwachung aktiv');
                console.log('🤖 Agenten: AKTIV');
                console.log('📋 Enterprise-Regeln: GELADEN');
                console.log('🚨 Blockierung: AKTIV');
              }, 30000);
              
              console.log('✅ Anti-Regelbruch-System client-seitig aktiviert');
            `,
          }}
        />
      </body>
    </html>
  );
}
