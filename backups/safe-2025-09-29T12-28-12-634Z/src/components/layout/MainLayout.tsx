/**
 * import React from 'react';
 * @description Auto-generated documentation
 */
import React from "react";
import Footer from "../Core/Footer";
import Header from "../Core/Header";

interface MainLayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, showFooter = true }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-16 md:py-20 lg:py-24">{children}</main>
      <Footer showFooter={showFooter} />
    </div>
  );
};
