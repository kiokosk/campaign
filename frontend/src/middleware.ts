import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;
    
    if (path.startsWith("/brand") && token?.role !== "BRAND") {
      return NextResponse.redirect(new URL("/auth/unauthorized", req.url));
    }
    
    if (path.startsWith("/influencer") && token?.role !== "INFLUENCER") {
      return NextResponse.redirect(new URL("/auth/unauthorized", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
);

export const config = {
  matcher: ["/brand/:path*", "/influencer/:path*"]
};