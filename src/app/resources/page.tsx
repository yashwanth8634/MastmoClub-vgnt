import { Metadata } from "next";
import ResourcesContent from "@/components/features/resources/ResourcesContent";

export const metadata: Metadata = {
  title: "Learning Resources ",
  description: "Curated materials for Mathematics, Coding, Machine Learning, and Data Science.",
};

export default function ResourcesPage() {
  return <ResourcesContent />;
}