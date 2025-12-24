"use client";

import { useEffect } from "react";

export default function ContentProtection() {
  useEffect(() => {
    // 1. Disable Right Click
    const handleContext = (e: MouseEvent) => {
      e.preventDefault();
    };

    // 2. Disable Keyboard Shortcuts (F12, Inspect, Print, Save, View Source)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "F12" || 
        (e.ctrlKey && e.shiftKey && e.key === "I") || // Chrome DevTools
        (e.ctrlKey && e.shiftKey && e.key === "J") || // Chrome Console
        (e.ctrlKey && e.shiftKey && e.key === "C") || // Element Inspector
        (e.ctrlKey && e.key === "u") || // View Source
        (e.ctrlKey && e.key === "s") || // Save Page
        (e.ctrlKey && e.key === "p")    // Print Page
      ) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    // 3. Disable Image Dragging (Global)
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
    };

    document.addEventListener("contextmenu", handleContext);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("dragstart", handleDragStart);

    return () => {
      document.removeEventListener("contextmenu", handleContext);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("dragstart", handleDragStart);
    };
  }, []);

  return null; // This component renders nothing, just runs logic
}