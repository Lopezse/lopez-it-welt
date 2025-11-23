import AdminLayout from "@/components/admin/AdminLayout";
import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Admin - Lopez IT Welt",
  description: "Administrationsbereich der Lopez IT Welt",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>;
}
