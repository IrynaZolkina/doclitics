// src/app/api/auth/logout/route.js
import { NextResponse } from "next/server";
import clientPromise, { getRefreshTokensCollection } from "@/lib/mongodb"; // your Mongo client
import { verifyRefreshToken } from "@/lib/jwt";
import { verifyRefreshTokenHashed } from "@/utils/tokens";
import { errorResponse } from "@/utils/apiFetch";

export async function POST(req) {
  const refreshToken = req.cookies.get("refreshToken")?.value;
  const csrfHeader = req.headers.get("x-csrf-token");
  const csrfCookie = req.cookies.get("csrfToken")?.value;
  const res = NextResponse.json({ message: "Logged out" });

  // 1. CSRF check
  if (!csrfHeader || csrfHeader !== csrfCookie) {
    return errorResponse("CSRF_FAIL", "Invalid CSRF token", 403);
  }

  if (!refreshToken) {
    return errorResponse("NO_TOKEN", "No refresh token", 401);
  }
  // 1. Get refreshToken from cookies

  console.log("Logout refresh token:??????????????????? ", refreshToken);
  const accessToken = req.cookies.get("refreshToken")?.value;
  console.log("Logout accessToken token:??????????????????? ", accessToken);

  // 2. Remove refresh token from DB

  try {
    const tokensCollection = await getRefreshTokensCollection();
    const hashed = hashTokenSha256(refreshToken);

    // 2. Remove only this device/session's refresh token
    await tokensCollection.deleteOne({ hashedToken: hashed });

    // 3. Clear cookies for this browser
    const res = NextResponse.json({ message: "Logged out" });
    res.cookies.set("accessToken", "", { maxAge: 0, path: "/" });
    res.cookies.set("refreshToken", "", { maxAge: 0, path: "/" });
    res.cookies.set("csrfToken", "", { maxAge: 0, path: "/" });

    return res;
  } catch (err) {
    console.error("Logout error:", err);
    return errorResponse("LOGOUT_FAILED", "Logout failed", 500);
  }

  return res;
}
