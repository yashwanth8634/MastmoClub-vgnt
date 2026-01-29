import MathLoader from "@/components/ui/MathLoader";

export default function Loading() {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-black text-[#00f0ff]">
      <MathLoader size="lg" />
    </div>
  );
}