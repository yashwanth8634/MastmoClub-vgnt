import { NextResponse } from "next/server";

const BASE_URL = "https://www.mastmovgnt.in";

/**
 * OAuth 2.0 Authorization Server Metadata per RFC 8414.
 * MASTMO uses internal JWT-cookie auth — no third-party OAuth grants are supported.
 * This stub exists so agent discovery crawlers find a valid response.
 * https://www.rfc-editor.org/rfc/rfc8414
 */
export async function GET() {
  const metadata = {
    issuer: BASE_URL,
    authorization_endpoint: `${BASE_URL}/admin/login`,
    token_endpoint: `${BASE_URL}/api/internal/auth`,
    response_types_supported: [],
    grant_types_supported: [],
    scopes_supported: [],
    // Agent registration block per auth.md spec
    agent_auth: {
      register_uri: null,
      supported_identity_types: [],
      supported_credential_types: [],
      note: "MASTMO uses internal JWT-cookie authentication. No programmatic agent registration is available.",
    },
  };

  return NextResponse.json(metadata, {
    status: 200,
    headers: {
      "Cache-Control": "public, max-age=3600",
    },
  });
}
