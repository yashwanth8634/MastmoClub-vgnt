import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Tailwind helper (you likely already have this)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ✅ NEW: Date Formatter
export function formatDate(dateString: string) {
  if (!dateString) return "TBA";
  const date = new Date(dateString);
  
  // Returns: "October 9, 2025"
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}