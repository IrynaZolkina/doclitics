// /api/auth/refresh/route.js
import { NextResponse } from "next/server";

import { errorResponse } from "@/lib/responsehandlers/errorResponse";
import { getCsrfTokens, validateCsrf } from "@/lib/auth/csrf";
import { getStoredRefreshToken } from "@/lib/auth/refreshHelpers/getStoredRefreshToken";
import { revokeAllUserSessions } from "@/lib/auth/refreshHelpers/revokeAllUserSessions";
import { isTokenExpired } from "@/lib/auth/refreshHelpers/isTokenExpired";
import { rotateRefreshToken } from "@/lib/auth/refreshHelpers/rotateRefreshToken";
import { verifyRefreshTokenAndGetPayload } from "@/lib/auth/refreshHelpers/verifyRefreshTokenAndGetPayload";

export async function POST(req) {
  console.log("Running token refresh - BACKend ............");
  try {
    // 1️⃣ CSRF check
    const { csrfHeader, csrfCookie } = getCsrfTokens(req);
    validateCsrf(csrfHeader, csrfCookie);

    // 2️⃣ Check refresh token exists
    const refreshToken = req.cookies.get("refreshToken")?.value;
    if (!refreshToken)
      return errorResponse("NO_TOKEN", "No refresh token", 401);

    const payload = verifyRefreshTokenAndGetPayload(refreshToken);

    const tokenDoc = await getStoredRefreshToken(refreshToken);
    if (!tokenDoc) {
      await revokeAllUserSessions(payload.userId);
      return errorResponse("TOKEN_REUSE", "Token reuse detected", 401);
    }

    if (isTokenExpired(tokenDoc)) {
      await revokeAllUserSessions(payload.userId);
      return errorResponse("TOKEN_EXPIRED", "Refresh token expired", 401);
    }

    const {
      newAccessToken,
      newRefreshToken,
      accessTokenCookieMaxAge,
      refreshTokenCookieMaxAge,
    } = await rotateRefreshToken(tokenDoc, payload);

    const res = NextResponse.json({ success: true }, { status: 200 });
    res.cookies.set("accessToken", newAccessToken, {
      httpOnly: true,
      //secure: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: accessTokenCookieMaxAge, // 6 min
      path: "/",
    });
    res.cookies.set("refreshToken", newRefreshToken, {
      httpOnly: true,
      //secure: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: refreshTokenCookieMaxAge, // 30 days
      path: "/",
    });

    return res;
  } catch (err) {
    // Catch **any unexpected error**
    return errorResponse(
      err.code || "UNAUTHORIZED",
      err.message || "Unauthorized",
      401,
    );
  }
}
