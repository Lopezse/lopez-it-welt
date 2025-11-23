import AdminLayout from "@/components/admin/AdminLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin - Lopez IT Welt",
  description: "Administrationsbereich der Lopez IT Welt",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminLayout>{children}</AdminLayout>
    </div>
  );
}
