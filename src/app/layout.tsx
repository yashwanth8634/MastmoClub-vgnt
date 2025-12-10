import type { Metadata } from "next";
import { MedievalSharp } from "next/font/google"; 
import "./globals.css";
import StarField from "@/components/3d/StarField";

const spaceGrotesk = MedievalSharp({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mastmo@Vgnt",
  description: "Mathematical & Statistical Modeling Club",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* ✅ FIX: suppressHydrationWarning on html tag */}
      <body 
        className={`${spaceGrotesk.className} antialiased  text-white font-sans`}
      >
        <StarField />
        {children}
      </body>
    </html>
  );
}