// middleware.js
import { NextResponse } from "next/server";

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  console.log("MIDDLEWARE RUNNING...........", req.nextUrl.pathname);

  // ✅ Skip next internals / files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  // If no refresh token, nothing to refresh
  if (!refreshToken) return NextResponse.next();

  // If access token exists, proceed (page will verify it)
  if (accessToken) return NextResponse.next();

  // Access missing -> refresh using server-only endpoint
  const cookieHeader = req.headers.get("cookie") || "";

  const refreshRes = await fetch(
    `${process.env.APP_URL}/api/auth/refresh-server`,
    {
      method: "POST",
      headers: {
        cookie: cookieHeader,
        "x-internal-refresh-secret": process.env.INTERNAL_REFRESH_SECRET,
      },
      cache: "no-store",
    },
  );

  if (!refreshRes.ok) return NextResponse.next();

  // Forward Set-Cookie to browser
  const res = NextResponse.next();
  const setCookie = refreshRes.headers.get("set-cookie");
  if (setCookie) res.headers.set("set-cookie", setCookie);
  return res;
}

export const config = {
  matcher: ["/:path*"],
};
