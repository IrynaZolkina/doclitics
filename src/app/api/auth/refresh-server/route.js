// /api/auth/refresh-server/route.js
import { NextResponse } from "next/server";
import { errorResponse } from "@/lib/responsehandlers/errorResponse";
import { getStoredRefreshToken } from "@/lib/auth/refreshHelpers/getStoredRefreshToken";
import { revokeAllUserSessions } from "@/lib/auth/refreshHelpers/revokeAllUserSessions";
import { isTokenExpired } from "@/lib/auth/refreshHelpers/isTokenExpired";
import { rotateRefreshToken } from "@/lib/auth/refreshHelpers/rotateRefreshToken";
import { verifyRefreshTokenAndGetPayload } from "@/lib/auth/refreshHelpers/verifyRefreshTokenAndGetPayload";

export async function POST(req) {
  console.log(
    "..........POST request received at /api/auth/refresh-server..........",
  );

  try {
    // ✅ Server-only guard
    const secret = req.headers.get("x-internal-refresh-secret");
    if (!secret || secret !== process.env.INTERNAL_REFRESH_SECRET) {
      return errorResponse("FORBIDDEN", "Not allowed", 403);
    }

    // ✅ Check refresh token exists (HttpOnly cookie)
    const refreshToken = req.cookies.get("refreshToken")?.value;
    if (!refreshToken) {
      return errorResponse("NO_TOKEN", "No refresh token", 401);
    }

    // ✅ Verify refresh token signature + payload
    const payload = verifyRefreshTokenAndGetPayload(refreshToken);

    // ✅ Ensure refresh token is still stored (reuse detection)
    const tokenDoc = await getStoredRefreshToken(refreshToken);
    if (!tokenDoc) {
      await revokeAllUserSessions(payload.userId);
      return errorResponse("TOKEN_REUSE", "Token reuse detected", 401);
    }

    // ✅ Ensure refresh token not expired per DB
    if (isTokenExpired(tokenDoc)) {
      await revokeAllUserSessions(payload.userId);
      return errorResponse("TOKEN_EXPIRED", "Refresh token expired", 401);
    }

    // ✅ Rotate refresh token + issue new access token
    const {
      newAccessToken,
      newRefreshToken,
      accessTokenCookieMaxAge,
      refreshTokenCookieMaxAge,
    } = await rotateRefreshToken(tokenDoc, payload);

    const res = NextResponse.json({ success: true }, { status: 200 });

    res.cookies.set("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: accessTokenCookieMaxAge,
      path: "/",
    });

    res.cookies.set("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: refreshTokenCookieMaxAge,
      path: "/",
    });

    return res;
  } catch (err) {
    return errorResponse(
      err.code || "UNAUTHORIZED",
      err.message || "Unauthorized",
      401,
    );
  }
}
