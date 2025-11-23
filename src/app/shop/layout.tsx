import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Globaler Header aus Datenbank */}
      <Header />

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Globaler Footer aus Datenbank */}
      <Footer />
    </div>
  );
}
