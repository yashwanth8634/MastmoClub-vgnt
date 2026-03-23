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

export function formatEventTime(timeString: string) {
  if (!timeString) return "TBA";

  const twelveHourMatch = timeString.match(/^(\d{1,2}):(\d{2})\s*([AP]M)$/i);
  if (twelveHourMatch) {
    const [, hour, minute, period] = twelveHourMatch;
    return `${Number(hour)}:${minute} ${period.toUpperCase()}`;
  }

  const twentyFourHourMatch = timeString.match(/^([01]\d|2[0-3]):([0-5]\d)$/);
  if (!twentyFourHourMatch) {
    return timeString;
  }

  const [, hourString, minute] = twentyFourHourMatch;
  const hour = Number(hourString);
  const period = hour >= 12 ? "PM" : "AM";
  const normalizedHour = hour % 12 || 12;

  return `${normalizedHour}:${minute} ${period}`;
}
