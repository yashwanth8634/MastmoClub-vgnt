import { NextResponse } from "next/server";

/**
 * MCP Server Card per SEP-1649.
 * Tells agents about the MCP server's capabilities and transport.
 * https://github.com/modelcontextprotocol/modelcontextprotocol/pull/2127
 */
export async function GET() {
  const serverCard = {
    serverInfo: {
      name: "MASTMO Club",
      version: "1.0.0",
      description:
        "Mathematical and Statistical Modeling Club at Vignan Institute of Technology — events, resources, and community.",
    },
    transport: {
      type: "streamable-http",
      endpoint: "https://www.mastmovgnt.in/api/mcp",
    },
    capabilities: {
      tools: true,
      resources: false,
      prompts: false,
    },
  };

  return NextResponse.json(serverCard, {
    status: 200,
    headers: {
      "Cache-Control": "public, max-age=3600",
    },
  });
}
