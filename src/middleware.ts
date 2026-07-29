import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAuthToken } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Markdown content negotiation — RFC 7231 Accept header handling.
  //    Rewrite homepage requests with Accept: text/markdown to the markdown API.
  if (pathname === "/") {
    const accept = request.headers.get("accept") ?? "";
    if (accept.includes("text/markdown")) {
      return NextResponse.rewrite(new URL("/api/markdown", request.url));
    }
  }

  // 2. Protect /admin routes
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("auth_token")?.value;
    
    // Check if user is visiting login page
    if (pathname === "/admin/login") {
      if (token) {
        const payload = await verifyAuthToken(token);
        if (payload) {
          // User is already logged in, redirect to dashboard
          return NextResponse.redirect(new URL("/admin/dashboard-group/dashboard", request.url));
        }
      }
      // Allow access to login page if not logged in
      return NextResponse.next();
    }

    if (!token) {
      // Redirect to login if no token
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Verify token validity
    const payload = await verifyAuthToken(token);

    if (!payload) {
      // Redirect to login if token is invalid/expired
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Token is valid, proceed
    return NextResponse.next();
  }

  // Allow all other routes
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Homepage — for markdown content negotiation
    "/",
    // All /admin paths — for auth protection
    "/admin/:path*",
  ],
};

