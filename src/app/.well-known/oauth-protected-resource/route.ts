import { NextResponse } from "next/server";

const BASE_URL = "https://www.mastmovgnt.in";

/**
 * OAuth Protected Resource Metadata per RFC 9728.
 * Points agents to the authorization server metadata for token issuance.
 * https://www.rfc-editor.org/rfc/rfc9728
 */
export async function GET() {
  const metadata = {
    resource: BASE_URL,
    authorization_servers: [BASE_URL],
    scopes_supported: [],
    bearer_methods_supported: ["header"],
    resource_documentation: `${BASE_URL}/.well-known/agent-skills/index.json`,
  };

  return NextResponse.json(metadata, {
    status: 200,
    headers: {
      "Cache-Control": "public, max-age=3600",
    },
  });
}
