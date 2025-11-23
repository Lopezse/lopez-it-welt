import { ClientLayout } from "@/components/Core/ClientLayout";
import Footer from "../../components/Core/Footer";
import Header from "../../components/Core/Header";
import "../globals.css";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClientLayout>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </div>
    </ClientLayout>
  );
}
