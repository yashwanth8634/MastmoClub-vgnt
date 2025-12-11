import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-4 text-[#00f0ff]">
        <Loader2 className="h-10 w-10 animate-spin" />
        <p className="font-mono text-sm uppercase tracking-widest">Loading Dashboard...</p>
      </div>
    </div>
  );
}