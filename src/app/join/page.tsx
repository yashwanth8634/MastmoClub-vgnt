import Navbar from "@/components/ui/Navbar";
import MembershipForm from "@/components/features/MembershipForm";

export default function JoinPage() {
  return (
    <main className="min-h-screen bg-black text-white font-sans pt-32 px-4 pb-20 selection:bg-[#00f0ff]/30">
      <Navbar />
      <div className="flex items-center justify-center">
        <MembershipForm />
      </div>
    </main>
  );
}