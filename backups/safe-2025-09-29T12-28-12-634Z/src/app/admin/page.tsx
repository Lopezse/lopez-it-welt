import { redirect } from "next/navigation";

export default function AdminPage() {
  // Redirect to the new Enterprise Dashboard
  redirect("/admin/dashboard");
}
