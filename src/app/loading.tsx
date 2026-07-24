import MathLoader from "@/components/ui/MathLoader";

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center text-[#00f0ff]">
      <MathLoader size="lg" />
    </div>
  );
}
