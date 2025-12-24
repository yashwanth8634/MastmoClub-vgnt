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
import ChatBot from "@/components/ui/ChatBot";
import GlobalPopup from "@/components/ui/GlobalPopup"; // ✅ 1. Import Popup
import { getPopup } from "@/actions/popupActions";     
import ContentProtection from "@/components/ContentProtection";


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
    "Join MASTMO, the Mathematical Modeling Club at Vignan Institute of Technology. Participate in events, workshops, and hackathons!",
  
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
    title: "Join the Mathematical Modeling Club at Vignan Institute",
    description:
      "Join MASTMO, the Mathematical Modeling Club at Vignan Institute of Technology. Participate in events, workshops, and hackathons!.",
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
    title: "Join the Mathematical Modeling Club at Vignan Institute",
    description:
      "Join MASTMO, the Mathematical Modeling Club at Vignan Institute of Technology. Participate in events, workshops, and hackathons!",
    images: ["https://www.mastmovgnt.in/icon.png"]
  },

  alternates: {
    canonical: "https://www.mastmovgnt.in"
  }
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const popupData = await getPopup();
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
        <ContentProtection />
        <StarField />
        <Navbar />
        {children}
        <GlobalPopup popupData={popupData} />
        <ChatBot />
        <Analytics />
        <SpeedInsights />
      </body>

      <GoogleAnalytics gaId="G-JNQY7WG0HS" />
    </html>
  );
}


