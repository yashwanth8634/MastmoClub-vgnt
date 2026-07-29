import { NextResponse } from "next/server";
import crypto from "crypto";

const BASE_URL = "https://www.mastmovgnt.in";

/**
 * Agent Skills Discovery Index (v0.2.0).
 * Lists the skills this site exposes for AI agent discovery.
 * https://github.com/cloudflare/agent-skills-discovery-rfc
 */
export async function GET() {
  const skills = [
    {
      name: "navigate-events",
      type: "action",
      description:
        "Navigate to the MASTMO club events page to browse upcoming and past events, hackathons, and workshops.",
      url: `${BASE_URL}/events`,
      sha256: crypto
        .createHash("sha256")
        .update("navigate-events-v1")
        .digest("hex"),
    },
    {
      name: "navigate-join",
      type: "action",
      description:
        "Navigate to the MASTMO club membership page to learn how to join the club.",
      url: `${BASE_URL}/join`,
      sha256: crypto
        .createHash("sha256")
        .update("navigate-join-v1")
        .digest("hex"),
    },
    {
      name: "navigate-team",
      type: "action",
      description:
        "Navigate to the MASTMO club team page to see leadership and members.",
      url: `${BASE_URL}/team`,
      sha256: crypto
        .createHash("sha256")
        .update("navigate-team-v1")
        .digest("hex"),
    },
    {
      name: "check-health",
      type: "api",
      description:
        "Check the health status of the MASTMO website API.",
      url: `${BASE_URL}/api/health`,
      sha256: crypto
        .createHash("sha256")
        .update("check-health-v1")
        .digest("hex"),
    },
  ];

  const index = {
    $schema:
      "https://raw.githubusercontent.com/cloudflare/agent-skills-discovery-rfc/main/schema/v0.2.0/index.schema.json",
    skills,
  };

  return NextResponse.json(index, {
    status: 200,
    headers: {
      "Cache-Control": "public, max-age=3600",
    },
  });
}
