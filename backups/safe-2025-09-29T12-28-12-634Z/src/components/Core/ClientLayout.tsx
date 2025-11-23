"use client";

import { CookieBanner } from "@/components/Features/CookieBanner";
import { KITrackingProvider } from "@/components/Features/KITrackingProvider";
import { RuleEnforcementProvider } from "@/components/Features/RuleEnforcementSystem";
import { ScrollToTop } from "@/components/Features/ScrollToTop";
import I18nProvider from "../Features/I18nProvider";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <RuleEnforcementProvider>
        <KITrackingProvider>
          {children}
          <CookieBanner />
          <ScrollToTop />
        </KITrackingProvider>
      </RuleEnforcementProvider>
    </I18nProvider>
  );
}
