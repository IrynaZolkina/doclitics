import { NextResponse } from "next/server";

export async function GET(req) {
  return NextResponse.json({
    hasAccess: !!req.cookies.get("accessToken")?.value,
    hasRefresh: !!req.cookies.get("refreshToken")?.value,
    hasCsrf: !!req.cookies.get("csrfToken")?.value,
    csrfHeader:
      req.headers.get("x-csrf-token") ||
      req.headers.get("X-CSRF-Token") ||
      null,
  });
}
