import HomeContent from "@/components/home/HomeContent";
import GlobalPopup from "@/components/ui/GlobalPopup"; // ✅ 1. Import Popup
import { getPopup } from "@/actions/popupActions";     // ✅ 2. Import Data Fetcher


export const dynamic = "force-dynamic"; // ✅ Ensure we always get the latest Popup status

export default async function Home() {
  // ✅ 3. Fetch the popup data from the database
  

  return (
    <main className="relative bg-transparent text-white font-sans selection:bg-[#00f0ff]/30">
      
      {/* ✅ 4. Add the Popup Component Here */}
      

      {/* NOTE: Navbar is in layout.tsx, so no need to add it here */}
      
      <HomeContent />
      
    </main>
  );
}