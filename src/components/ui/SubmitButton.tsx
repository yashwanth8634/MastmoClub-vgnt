"use client";

import { useFormStatus } from "react-dom";
import MathLoader from "@/components/ui/MathLoader";

export default function SubmitButton({
  text = "Submit Application",
  loadingText = "Submitting...",
  fullPageLoader = false,
}: {
  text?: string;
  loadingText?: string;
  fullPageLoader?: boolean;
}) {
  const { pending } = useFormStatus();

  return (
    <>
      {pending && fullPageLoader && (
        <div className="fixed inset-0 z-9999 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in duration-300">
          <MathLoader size="lg" />
          <p className="text-math-cyan mt-6 font-mono text-lg animate-pulse tracking-widest uppercase">
            {loadingText}
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className={`
          w-full py-3 px-4 rounded-lg font-bold text-black transition-all duration-200
          flex items-center justify-center gap-2 cursor-pointer
          ${
            pending
              ? "bg-gray-600 cursor-not-allowed opacity-70"
              : "bg-math-cyan hover:bg-white hover:shadow-[0_0_15px_rgba(0,240,255,0.5)]"
          }
        `}
      >
        {pending ? (
          <>
            {!fullPageLoader && <MathLoader size="sm" className="text-black" />}
            <span>{loadingText}</span>
          </>
        ) : (
          text
        )}
      </button>
    </>
  );
}
