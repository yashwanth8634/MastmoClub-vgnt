import type { Metadata } from "next";
import { MedievalSharp } from "next/font/google"; 
import "./globals.css";
import StarField from "@/components/3d/StarField";
import { GoogleAnalytics } from '@next/third-parties/google';
import Navbar from "@/components/ui/Navbar";

const spaceGrotesk = MedievalSharp({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata : Metadata = {
  metadataBase: new URL("https://www.mastmovgnt.in"),
  title: {
    default: "Mastmo@Vgnt | Math & Stats Club",
    template: "%s | MASTMO VGNT"
  },
  description:
    "MASTMO is the official Math & Stats Club of VGNT. We organize events, hackathons, modeling workshops, and research activities for students.",
  
  keywords: [
    // Club Identity
    "MASTMO", "MASTMO Club", "VGNT Club", "Vignan Math Club",
    
    // College & Location
    "Vignan's Institute of Information Technology", "VGNT Deshmukhi",
    "VIIT Student Clubs", "Engineering Club Hyderabad", "vgnt",
    
    // Core Subjects
    "Mathematical Modeling", "Statistical Analysis",
    "Mathematics", "Statistics",
    
    // Activities & Interests
    "Hackathons", "Data Science Workshop", "Machine Learning",
    "Student Research", "Coding Competitions", "Tech Community",
    
    // Variations for Search
    "MASTMO VGNT", "Join math club", "Vignan student chapters"
  ],

  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png"
  },

  openGraph: {
    title: "MASTMO @ VGNT | Math & Stats Student Club",
    description:
      "Join the official Math & Stats Club of VGNT. Participate in events, modeling challenges, hackathons, and research workshops.",
    url: "https://www.mastmovgnt.in",
    siteName: "MASTMO Club",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://www.mastmovgnt.in/icon.png",
        width: 512,
        height: 512,
        alt: "Mastmo Club Logo"
      }
    ]
  },

  twitter: {
    card: "summary_large_image",
    title: "MASTMO @ VGNT",
    description:
      "Explore mathematics, statistics, events, and student-driven projects with MASTMO.",
    images: ["https://www.mastmovgnt.in/icon.png"]
  },

  alternates: {
    canonical: "https://www.mastmovgnt.in"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head suppressHydrationWarning>
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "MASTMO Club",
        url: "https://www.mastmovgnt.in",
        logo: "https://www.mastmovgnt.in/icon.png",
        sameAs: [
          "https://instagram.com/", 
          "https://www.linkedin.com/" 
        ]
      })
    }}
  />

  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        url: "https://www.mastmovgnt.in",
        name: "MASTMO Club",
        potentialAction: {
          "@type": "SearchAction",
          target: "https://www.mastmovgnt.in/?s={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      })
    }}
  />

</head>

      <body className={`${spaceGrotesk.className} antialiased text-white font-sans`}>
        <StarField />
        <Navbar />
        {children}
      </body>

      <GoogleAnalytics gaId="G-JNQY7WG0HS" />
    </html>
  );
}


