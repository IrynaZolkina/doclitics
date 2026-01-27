// lib/apiFetchServer.js
"use server";

import {
  verifyRefreshToken,
  signAccessToken,
  signRefreshToken,
} from "@/lib/jwt";
import { getRefreshTokensCollection } from "@/lib/mongodb/mongodb";
import { hashTokenSha256 } from "@/utils/tokens";
import { NextResponse } from "next/server";

const ACCESS_TOKEN_MINUTES = parseInt(
  process.env.ACCESS_TOKEN_MINUTES || "6",
  10
);
const REFRESH_TOKEN_DAYS = parseInt(process.env.REFRESH_TOKEN_DAYS || "20", 10);

const accessTokenExpirySeconds = ACCESS_TOKEN_MINUTES * 60;
const accessTokenCookieMaxAge = (ACCESS_TOKEN_MINUTES + 1) * 60;
const refreshTokenExpiryMs = REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000;
const refreshTokenCookieMaxAge = REFRESH_TOKEN_DAYS * 24 * 60 * 60;

export async function apiFetchServer(req, url, options = {}) {
  options.headers = options.headers || {};
  options.credentials = "include"; // required for cookies

  const csrfHeader = req.headers.get("x-csrf-token");
  const csrfCookie = req.cookies.get("csrfToken")?.value;
  if (!csrfHeader || csrfHeader !== csrfCookie) {
    return NextResponse.json({ error: "CSRF_MISMATCH" }, { status: 403 });
  }

  // Original fetch
  let res = await fetch(url, options);

  // If access token expired, attempt refresh
  if (res.status === 401 || res.status === 403) {
    const refreshToken = req.cookies.get("refreshToken")?.value;
    if (!refreshToken) {
      return NextResponse.json({ error: "NO_REFRESH_TOKEN" }, { status: 401 });
    }

    try {
      // Verify refresh token
      const payload = verifyRefreshToken(refreshToken);
      const tokensCollection = await getRefreshTokensCollection();

      const hashedIncoming = hashTokenSha256(refreshToken);
      const tokenDoc = await tokensCollection.findOne({
        hashedToken: hashedIncoming,
      });

      if (!tokenDoc) {
        await tokensCollection.deleteMany({ userId: payload.userId });
        return NextResponse.json({ error: "TOKEN_REUSE" }, { status: 401 });
      }

      const now = new Date();
      if (
        tokenDoc.expiresAt &&
        now.getTime() > new Date(tokenDoc.expiresAt).getTime()
      ) {
        await tokensCollection.deleteOne({ _id: tokenDoc._id });
        return NextResponse.json({ error: "TOKEN_EXPIRED" }, { status: 401 });
      }

      // Sign new access & refresh tokens
      const newAccessToken = signAccessToken({
        userId: payload.userId,
        username: payload.username,
        email: payload.email,
      });
      const newRefreshToken = signRefreshToken({
        userId: payload.userId,
        username: payload.username,
        email: payload.email,
      });
      const newHashed = hashTokenSha256(newRefreshToken);

      // Rotate token in DB
      const expires = new Date(now.getTime() + refreshTokenExpiryMs);
      await tokensCollection.updateOne(
        { _id: tokenDoc._id },
        {
          $set: { hashedToken: newHashed, updatedAt: now, expiresAt: expires },
        },
        { upsert: true }
      );

      // Set cookies on server response
      const serverRes = NextResponse.next();
      serverRes.cookies.set("accessToken", newAccessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: accessTokenCookieMaxAge,
        path: "/",
      });
      serverRes.cookies.set("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: refreshTokenCookieMaxAge,
        path: "/",
      });

      // Retry original request
      res = await fetch(url, options);
      return res;
    } catch (err) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }
  }

  return res;
}
