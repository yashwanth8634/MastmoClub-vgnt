import { Metadata } from "next";
import PopupManager from "@/components/admin/PopupManager";

export const metadata: Metadata = {
  title: "Manage Popup ",
  description: "Configure the homepage popup announcement.",
};

export default function AdminPopupPage() {
  return <PopupManager />;
}