import type { Metadata } from "next";
import { MedievalSharp } from "next/font/google"; 
import "./globals.css";
import StarField from "@/components/3d/StarField";
import { GoogleAnalytics } from '@next/third-parties/google';

const spaceGrotesk = MedievalSharp({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.mastmovgnt.in'),
  alternates: {
    canonical: '/',
  },
  title: "Mastmo@Vgnt | Official Math & Stats Club of VGNT",
  description: "Join MASTMO Club at VGNT. Participate in hackathons, modeling events, and research workshops. The official student community for mathematics.",
  keywords: [
    // Club Identity
    "MASTMO", "MASTMO Club", "VGNT Club", "Vignan Math Club",
    
    // College & Location
    "Vignan's Institute of Information Technology", "VGNT Deshmukhi", "VIIT Student Clubs", "Engineering Club Hyderabad","vgnt",
    
    // Core Subjects
    "Mathematical Modeling", "Statistical Analysis", "Mathematics", "Statistics",
    
    // Activities & Interests
    "Hackathons", "Data Science Workshop", "Machine Learning", "Student Research", "Coding Competitions", "Tech Community",
    
    // Variations for Search
    "MASTMO VGNT", "Join math club", "Vignan student chapters"
  ],
  // Good practice to add your base URL too
  openGraph: {
    title: "MASTMO Club | VGNT",
    description: "Join the official Math & Stats Club of VGNT.",
    url: 'https://www.mastmovgnt.in',
    siteName: 'MASTMO Club',
    locale: 'en_US',
    type: 'website',
  },
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
        suppressHydrationWarning={true}
      >
        <StarField />
        {children}
      </body>
      <GoogleAnalytics gaId="G-JNQY7WG0HS" />
    </html>
  );
}


