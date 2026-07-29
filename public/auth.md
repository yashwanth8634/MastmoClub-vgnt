# auth.md — MASTMO Club Agent Authentication

**Site**: https://www.mastmovgnt.in  
**Last Updated**: 2025-07-29

## Overview

MASTMO is a student club website for the Mathematical and Statistical Modeling Club
at Vignan's Institute of Technology and Science (VGNT). The site is primarily
informational — it publishes events, team info, galleries, and resources.

## Authentication

MASTMO uses **internal JWT-cookie authentication** for administrative access only.
There are no public APIs requiring authentication and no OAuth/OIDC grants for
third-party agents.

### For AI Agents

- **No registration is required** to access public endpoints.
- All public pages, the API catalog, health check, and agent discovery endpoints
  are freely accessible.
- The `/admin` routes are protected and reserved for authorized club administrators.

### Discovery Endpoints (No Auth Required)

| Endpoint | Description |
|---|---|
| `/.well-known/api-catalog` | API catalog (RFC 9727) |
| `/.well-known/mcp/server-card.json` | MCP Server Card |
| `/.well-known/agent-skills/index.json` | Agent Skills index |
| `/.well-known/oauth-authorization-server` | OAuth metadata (informational) |
| `/.well-known/oauth-protected-resource` | Protected resource metadata |
| `/api/health` | Health check |

## Agent Registration

No programmatic agent registration is available. To request API access or
partnership, contact the club via the [/contact](https://www.mastmovgnt.in/contact)
page.
