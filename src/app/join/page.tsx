import MembershipForm from "@/components/features/MembershipForm";


export default function JoinPage() {
  return (
    <div className="min-h-screen pt-32 px-6 bg-black flex flex-col items-center">
      <div className="max-w-4xl w-full text-center mb-12">
        <h1 className="text-5xl font-bold mb-4">Join The Club</h1>
        <p className="text-gray-400">Fill out the application below to become an official member.</p>
      </div>
      
      {/* ✅ Loads the interactive client form here */}
      <MembershipForm />
    </div>
  );
}