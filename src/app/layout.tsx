import type { Metadata } from "next";
import { MedievalSharp } from "next/font/google"; 
import "./globals.css";
import StarField from "@/components/3d/StarField";
import { GoogleAnalytics } from '@next/third-parties/google';
import Navbar from "@/components/ui/Navbar";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react";


const spaceGrotesk = MedievalSharp({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata : Metadata = {
  metadataBase: new URL("https://www.mastmovgnt.in"),
  title: {
    default: "Mastmo@Vgnt | Mathematical & Statistical Modeling Club",
    template: "%s | Mastmo@Vgnt",
  },
  description:
    "MASTMO is the official Mathematical & Statistical Modeling Club of Vignan Institute of Technology and Science,Deshmukhi. We organize events, hackathons, modeling workshops, and research activities for students.",
  
  keywords: [
    // Club Identity
    "MASTMO", "MASTMO Club", "VGNT Club", "Vignan Math Club",
    
    // College & Location
    "Vignan's Institute of Technology and Science", "VGNT Deshmukhi",
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
    title: "MASTMO @ VGNT | Mathematical & Statistical Modeling Club",
    description:
      "Join the official Mathematical & Statistical Modeling Club of Vignan Institute of Technology and Science,Deshmukhi. Participate in events, modeling challenges, hackathons, and research workshops.",
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
        <NextSSRPlugin
          /**
           * The `extractRouterConfig` will extract all the route configs
           * from the router to prevent additional network requests.
           */
          routerConfig={extractRouterConfig(ourFileRouter)}
        />
        <StarField />
        <Navbar />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>

      <GoogleAnalytics gaId="G-JNQY7WG0HS" />
    </html>
  );
}


