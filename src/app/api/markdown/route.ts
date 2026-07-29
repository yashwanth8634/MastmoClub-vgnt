import { NextRequest, NextResponse } from "next/server";

// Approximate token count — 4 chars ≈ 1 token (GPT-style estimate).
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

const SITE_MARKDOWN = `# MASTMO Club — Mathematical & Statistical Modeling Club

**Site**: https://www.mastmovgnt.in  
**Institution**: Vignan's Institute of Technology and Science (VGNT), Deshmukhi, Hyderabad

## About

MASTMO is the Mathematical and Statistical Modeling Club at Vignan Institute of
Technology. It brings together students passionate about mathematics, statistics,
data science, and machine learning through events, workshops, and competitions.

## Key Sections

- **/about** — Club mission, history, and faculty advisors
- **/events** — Upcoming and past events (hackathons, workshops, competitions)
- **/team** — Current club leadership and members
- **/gallery** — Photos from past events
- **/join** — How to become a member
- **/resources** — Study materials and references
- **/contact** — Contact the club

## APIs & Discovery

| Endpoint | Purpose |
|---|---|
| \`/api/health\` | Service health status |
| \`/.well-known/api-catalog\` | API catalog (RFC 9727, application/linkset+json) |
| \`/.well-known/mcp/server-card.json\` | MCP Server Card (SEP-1649) |
| \`/.well-known/agent-skills/index.json\` | Agent Skills discovery index |
| \`/.well-known/oauth-protected-resource\` | OAuth Protected Resource Metadata |

## Contact

- Instagram: [@mastmo_vgnt](https://instagram.com/mastmo_vgnt)
- Email: Available via /contact page
`;

/**
 * Returns a markdown representation of the MASTMO homepage when the
 * client sends Accept: text/markdown (RFC 7231 content negotiation).
 * Called via a middleware rewrite — not intended for direct browser access.
 */
export async function GET(request: NextRequest) {
  const accept = request.headers.get("accept") ?? "";

  // Honour the Accept header; fall back gracefully if called directly.
  if (!accept.includes("text/markdown") && !accept.includes("*/*")) {
    return NextResponse.redirect(new URL("/", request.url), 302);
  }

  const tokenCount = estimateTokens(SITE_MARKDOWN);

  return new NextResponse(SITE_MARKDOWN, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "x-markdown-tokens": String(tokenCount),
      // Allow caching for 1 hour — content is mostly static.
      "Cache-Control": "public, max-age=3600",
    },
  });
}
