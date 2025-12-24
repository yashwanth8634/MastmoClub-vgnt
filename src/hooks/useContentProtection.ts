"use client";
import { useEffect } from "react";

export function useContentProtection() {
  useEffect(() => {
    // 🚫 Disable Right Click
    const handleContext = (e: Event) => e.preventDefault();
    
    // 🚫 Disable Shortcuts (F12, Ctrl+Shift+I, Ctrl+P)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "F12" || 
        (e.ctrlKey && e.shiftKey && e.key === "I") || 
        (e.ctrlKey && e.key === "u") || 
        (e.ctrlKey && e.key === "p")
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", handleContext);
    document.addEventListener("keydown", handleKeyDown);

    // 🚫 CSS Overlay to discourage screenshots (Optional/Aggressive)
    // Works by putting a 'secure' class on body
    document.body.style.userSelect = "none"; 
    document.body.style.webkitUserSelect = "none";

    return () => {
      document.removeEventListener("contextmenu", handleContext);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.userSelect = "auto";
    };
  }, []);
}