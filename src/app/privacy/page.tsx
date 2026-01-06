import { Metadata } from "next";
import PrivacyContent from "@/components/features/legal/PrivacyContent";

export const metadata: Metadata = {
  title: "Privacy Policy ",
  description: "Learn how MASTMO Club collects, uses, and protects your data.",
};

export default function PrivacyPage() {
  return <PrivacyContent />;
}