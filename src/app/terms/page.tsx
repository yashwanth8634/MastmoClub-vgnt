import { Metadata } from "next";
import TermsContent from "@/components/features/legal/TermsContent";

export const metadata: Metadata = {
  title: "Terms of Service ",
  description: "Membership eligibility, rules, and code of conduct for MASTMO Club.",
};

export default function TermsPage() {
  return <TermsContent />;
}