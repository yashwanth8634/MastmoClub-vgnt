import { Metadata } from "next";
import AdminLoginForm from "@/components/features/auth/AdminLoginForm";

export const metadata: Metadata = {
  title: "Admin Login ",
  description: "Restricted access for MASTMO administrators.",
};

export default function AdminLoginPage() {
  return <AdminLoginForm />;
}