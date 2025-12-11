import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Check for the admin session cookie
  const isAuth = request.cookies.get("admin_session")?.value === "true";

  // 1. PROTECTED ROUTES: If user is NOT logged in, block access to /admin/dashboard...
  if (path.startsWith("/admin") && !path.includes("/login") && !isAuth) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  // 2. ✅ THE FIX: If user IS logged in, block access to Login Page
  if (path === "/admin/login" && isAuth) {
    return NextResponse.redirect(new URL("/admin/dashboard-group/dashboard", request.url));
  }

  return NextResponse.next();
}

// Apply to all admin routes
export const config = {
  matcher: ["/admin/:path*"],
};