import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-black text-[#00f0ff]">
      <Loader2 className="w-12 h-12 animate-spin" />
    </div>
  );
}