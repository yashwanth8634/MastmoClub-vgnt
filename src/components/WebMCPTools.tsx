"use client";

import { useEffect } from "react";

/**
 * Registers site tools with the WebMCP API (navigator.modelContext)
 * so AI agents in the browser can discover and invoke key actions.
 * https://webmachinelearning.github.io/webmcp/
 *
 * This is a no-op in browsers that don't support the API.
 */
export default function WebMCPTools() {
  useEffect(() => {
    // Guard: WebMCP is only available in supporting browsers.
    if (
      typeof navigator === "undefined" ||
      !("modelContext" in navigator)
    ) {
      return;
    }

    const ctx = (navigator as Navigator & { modelContext: ModelContext }).modelContext;
    const controller = new AbortController();
    const { signal } = controller;

    const tools: ToolDefinition[] = [
      {
        name: "navigate_events",
        description:
          "Navigate to the MASTMO club events page showing upcoming and past events, hackathons, and workshops.",
        inputSchema: { type: "object", properties: {} },
        execute: async () => {
          window.location.href = "/events";
          return { success: true, navigatedTo: "/events" };
        },
      },
      {
        name: "navigate_join",
        description:
          "Navigate to the MASTMO club join page to learn how to become a member.",
        inputSchema: { type: "object", properties: {} },
        execute: async () => {
          window.location.href = "/join";
          return { success: true, navigatedTo: "/join" };
        },
      },
      {
        name: "navigate_team",
        description:
          "Navigate to the MASTMO club team page to see the current leadership and members.",
        inputSchema: { type: "object", properties: {} },
        execute: async () => {
          window.location.href = "/team";
          return { success: true, navigatedTo: "/team" };
        },
      },
      {
        name: "navigate_about",
        description:
          "Navigate to the MASTMO club about page for club mission, history, and faculty info.",
        inputSchema: { type: "object", properties: {} },
        execute: async () => {
          window.location.href = "/about";
          return { success: true, navigatedTo: "/about" };
        },
      },
      {
        name: "navigate_contact",
        description:
          "Navigate to the MASTMO club contact page.",
        inputSchema: { type: "object", properties: {} },
        execute: async () => {
          window.location.href = "/contact";
          return { success: true, navigatedTo: "/contact" };
        },
      },
      {
        name: "check_health",
        description:
          "Check whether the MASTMO website API is healthy. Returns JSON with status and timestamp.",
        inputSchema: { type: "object", properties: {} },
        execute: async () => {
          const res = await fetch("/api/health");
          return res.json();
        },
      },
    ];

    for (const tool of tools) {
      ctx.registerTool(tool, { signal });
    }

    return () => {
      controller.abort();
    };
  }, []);

  // Renders nothing — purely side-effect driven.
  return null;
}

// ── Local type definitions for the WebMCP API ──────────────────────────
// These types are not yet in lib.dom.d.ts; defined here to satisfy TS.

interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  execute: (input: Record<string, unknown>) => Promise<unknown>;
}

interface ModelContext {
  registerTool: (
    tool: ToolDefinition,
    options?: { signal?: AbortSignal }
  ) => void;
}
