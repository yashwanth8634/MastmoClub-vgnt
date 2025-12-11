import Link from "next/link";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-black text-center p-4">
      
      {/* 3D-style Text Effect */}
      <h1 className="text-[150px] font-bold leading-none text-transparent bg-clip-text bg-gradient-to-b from-[#00f0ff] to-transparent opacity-20 select-none">
        404
      </h1>
      
      <div className="-mt-20 z-10 space-y-6">
        <h2 className="text-3xl font-bold text-white">Page Not Found</h2>
        <p className="text-gray-400 max-w-md mx-auto">
          The coordinates you entered seem to be lost in space. 
          Let's get you back to the base.
        </p>
        
        <Link 
          href="/"
          className="inline-flex items-center gap-2 bg-[#00f0ff] text-black px-6 py-3 rounded-xl font-bold hover:bg-white transition-all"
        >
          <Home size={20} /> Return Home
        </Link>
      </div>

    </div>
  );
}