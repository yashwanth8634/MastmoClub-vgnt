"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react"; // Make sure you have lucide-react installed

export default function SubmitButton({ 
  text = "Submit Application", 
  loadingText = "Submitting..." 
}: { 
  text?: string; 
  loadingText?: string; 
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`
        w-full py-3 px-4 rounded-lg font-bold text-black transition-all duration-200
        flex items-center justify-center gap-2
        ${pending 
          ? "bg-gray-600 cursor-not-allowed opacity-70" 
          : "bg-[#00f0ff] hover:bg-white hover:shadow-[0_0_15px_rgba(0,240,255,0.5)]"
        }
      `}
    >
      {pending ? (
        <>
          <Loader2 className="animate-spin" size={20} />
          {loadingText}
        </>
      ) : (
        text
      )}
    </button>
  );
}