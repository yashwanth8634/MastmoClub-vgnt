import { NextResponse } from "next/server";

const BASE_URL = "https://www.mastmovgnt.in";

/**
 * API Catalog per RFC 9727.
 * Returns application/linkset+json describing the public API surface.
 * https://www.rfc-editor.org/rfc/rfc9727
 */
export async function GET() {
  const catalog = {
    linkset: [
      {
        // Root API anchor
        anchor: `${BASE_URL}/api`,
        "service-doc": [
          {
            href: `${BASE_URL}/.well-known/agent-skills/index.json`,
            type: "application/json",
            title: "MASTMO Agent Skills & API Discovery Index",
          },
        ],
        status: [
          {
            href: `${BASE_URL}/api/health`,
            type: "application/json",
            title: "Health Check",
          },
        ],
      },
    ],
  };

  return new NextResponse(JSON.stringify(catalog, null, 2), {
    status: 200,
    headers: {
      // Required content-type per RFC 9727
      "Content-Type": "application/linkset+json",
      // Allow public caching for 1 hour
      "Cache-Control": "public, max-age=3600",
    },
  });
}
