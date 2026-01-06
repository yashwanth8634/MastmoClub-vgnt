import type { Metadata } from "next";
import AboutContent from "@/components/features/about/AboutContent"; // Import the client part

// ✅ Now this works perfectly!
export const metadata: Metadata = {
  title: "About Us",
  description: "Meet the Experts Behind the MASTMO Club and explore our mission.",
};

export default function AboutPage() {
  return (
    <main>
      <AboutContent />
    </main>
  );
}