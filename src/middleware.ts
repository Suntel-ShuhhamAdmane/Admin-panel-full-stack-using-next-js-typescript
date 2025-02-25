import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const { pathname } = req.nextUrl;

  // If no token exists (user is logged out), redirect to login/error page
  if (!token) {
    const url = new URL("/", req.url); 
    url.searchParams.set("message", "Session expired. Please log in again.");
    return NextResponse.redirect(url);
  }

  // Restrict non-admins from accessing admin dashboard routes
  if (pathname.startsWith("/admin/dashboard") && pathname !== "/user/dashboard" && token.role !== "admin") {
    const url = new URL("/error", req.url);
    url.searchParams.set("message", "Access denied. You are not authorized.");
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/user/:path*"], // Protect dashboard routes
};
