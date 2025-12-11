
import HomeContent from "@/components/home/HomeContent"; // ✅ Import the client part

// ✅ SEO works here because this is a Server Component!


export default function Home() {
  return (
    <main className="relative bg-transparent text-white font-sans selection:bg-[#00f0ff]/30">
      
      {/* NOTE: Do NOT add <Navbar /> here. 
        It is already in layout.tsx, so it will show up automatically!
      */}
      
      <HomeContent />
      
    </main>
  );
}