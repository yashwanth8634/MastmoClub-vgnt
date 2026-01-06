import { Metadata } from "next";
import NotFoundContent from "@/components/ui/NotFoundContent";

export const metadata: Metadata = {
  title: "Page Not Found ",
  description: "The page you are looking for does not exist.",
};

export default function NotFound() {
  return <NotFoundContent />;
}