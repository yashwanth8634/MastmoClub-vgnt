"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

interface PopupData {
  isActive: boolean;
  title: string;
  description: string;
  images: string[];
  enableRegistration?: boolean;
  registrationEventId?: string;
}

const ContentProtection = dynamic(
  () => import("@/components/layout/ContentProtection"),
  { ssr: false },
);
const StarField = dynamic(() => import("@/components/3d/StarField"), {
  ssr: false,
});
const Navbar = dynamic(() => import("@/components/ui/Navbar"));
const ChatBot = dynamic(() => import("@/components/ui/ChatBot"), {
  ssr: false,
});
const GlobalPopup = dynamic(() => import("@/components/ui/GlobalPopup"), {
  ssr: false,
});

export default function SiteChrome({
  popupData,
}: {
  popupData: PopupData | null;
}) {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      <ContentProtection />
      <StarField />
      <Navbar />
      <GlobalPopup popupData={popupData} />
      <ChatBot />
    </>
  );
}
