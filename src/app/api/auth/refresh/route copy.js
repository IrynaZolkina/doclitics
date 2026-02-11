// /api/auth/refresh/route.js
import { NextResponse } from "next/server";
import {
  verifyRefreshToken,
  signAccessToken,
  signRefreshToken,
} from "@/lib/jwt";
import { getRefreshTokensCollection } from "@/lib/mongodb/mongodb";

import { hashTokenSha256 } from "@/lib/tokens";
import { errorResponse } from "@/lib/responsehandlers/errorResponse";
import { getCsrfTokens, validateCsrf } from "@/lib/auth/csrf";

// Load from env with defaults
const ACCESS_TOKEN_MINUTES = parseInt(
  process.env.ACCESS_TOKEN_MINUTES || "6",
  10,
);
const REFRESH_TOKEN_DAYS = parseInt(process.env.REFRESH_TOKEN_DAYS || "20", 10);

// Access token expiry
const accessTokenExpirySeconds = ACCESS_TOKEN_MINUTES * 60; // for JWT sign
const accessTokenCookieMaxAge = (ACCESS_TOKEN_MINUTES + 1) * 60; // +1 minute

// Refresh token expiry
const refreshTokenExpiryMs = REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000;
const refreshTokenCookieMaxAge = REFRESH_TOKEN_DAYS * 24 * 60 * 60; // in seconds for cookies

export async function POST(req) {
  try {
    // 1️⃣ CSRF check
    const { csrfHeader, csrfCookie } = getCsrfTokens(req);
    validateCsrf(csrfHeader, csrfCookie);

    // 2️⃣ Check refresh token exists
    const refreshToken = req.cookies.get("refreshToken")?.value;
    if (!refreshToken)
      return errorResponse("NO_TOKEN", "No refresh token", 401);

    try {
      // 1. Verify signature of refresh token (JWT check), checks expiry too
      const payload = verifyRefreshToken(refreshToken);
      // console.log("Refresh token payload:-------------------- ", payload);
      if (!payload) {
        return errorResponse("INVALID_TOKEN", "Invalid refresh token", 401);
      }

      const tokensCollection = await getRefreshTokensCollection();
      // 2. Hash incoming token
      // Multi-device: each device/session can have its own refresh token
      const hashedIncoming = hashTokenSha256(refreshToken);
      // 3. Find token document--Lookup stored hash
      const tokenDoc = await tokensCollection.findOne({
        hashedToken: hashedIncoming,
      });
      // console.log(
      //   tokenDoc,
      //   "---from DB tokenDoctokenDoctokenDoctokenDoctokenDoctokenDoc"
      // );

      if (!tokenDoc) {
        // 🚨 Token reuse or invalid
        console.warn("Refresh token reuse detected for user:", payload.userId);
        await tokensCollection.deleteMany({ userId: payload.userId }); // revoke all sessions
        // return errorResponse(
        //   "TOKEN_NOT_FOUND",
        //   "Refresh token reuse detected for user: " + payload.email,
        //   401
        // );
        // const res = NextResponse.json(
        //   { error: "Token reuse detected. Logged out." },
        //   { status: 401 }
        // );
        const res = errorResponse(
          "TOKEN_REUSE",
          "Token reuse detected. Logged out.",
          401,
        );
        res.cookies.set("accessToken", "", { maxAge: 0, path: "/" });
        res.cookies.set("refreshToken", "", { maxAge: 0, path: "/" });
        return res;
      }
      // console.log(
      //   "Stored refresh token фдд гыук from DB:-------------------- ",
      //   tokenDoc
      // );
      // 4. Check expiration
      const noww = Date.now();
      if (tokenDoc.expiresAt && noww > new Date(tokenDoc.expiresAt).getTime()) {
        await tokensCollection.deleteOne({ _id: tokenDoc._id });
        return errorResponse("TOKEN_EXPIRED", "Refresh token expired", 401);
        // return NextResponse.json(
        //   { error: "Refresh token expired" },
        //   { status: 401 }
        // );
      }

      const newAccessToken = signAccessToken({
        userId: payload.userId,
        username: payload.username,
        email: payload.email,
      });

      // --- ROTATION ---
      // 1. Create a new refresh token
      const newRefreshToken = signRefreshToken({
        userId: payload.userId,
        username: payload.username,
        email: payload.email,
      });
      // const csrfToken = crypto.randomBytes(24).toString("hex");
      const newHashed = hashTokenSha256(newRefreshToken);
      const now = new Date();
      const expires = new Date(now.getTime() + refreshTokenExpiryMs); // 20 days
      // ✅ Update the existing document instead of delete+insert
      await tokensCollection.updateOne(
        { _id: tokenDoc._id },
        {
          $set: {
            hashedToken: newHashed,
            updatedAt: now,
            expiresAt: expires,
          },
        },
        { upsert: true },
      );

      // await tokensCollection.deleteOne({ _id: tokenDoc._id }); // remove old token

      // await tokensCollection.insertOne({
      //   userId: payload.userId,
      //   hashedToken: newHashed,
      //   createdAt: new Date(),
      //   updatedAt: now, // 👈 keep track of latest update
      //   expiresAt: expires, //new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      //   userAgent: req.headers.get("user-agent") || "unknown", // optional, per-device info
      //   ip: req.headers.get("x-forwarded-for") || req.ip || "unknown", // optional
      // });

      // await tokensCollection.updateOne(
      //   { _id: tokenDoc._id },
      //   {
      //     $set: {
      //       hashedRefreshToken: newHashed,
      //       updatedAt: now,
      //       expiresAt: expires,
      //     },
      //   }
      // );

      const newPayload = {
        // userId: payload.userId,
        userId: payload.userId,
        username: payload.username,
        // id: payload.userId,
        email: payload.email,
      };
      // console.log("newPayLoad--------", newPayload);

      const res = NextResponse.json({ success: true }, { status: 200 });
      res.cookies.set("accessToken", newAccessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: accessTokenCookieMaxAge, // 6 min
        path: "/",
      });
      res.cookies.set("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: refreshTokenCookieMaxAge, // 30 days
        path: "/",
      });
      // res.cookies.set("csrfToken", csrfToken, {
      //   httpOnly: false,
      //   secure: true,
      //   sameSite: "strict",
      //   path: "/",
      // });

      return res;
    } catch (err) {
      return errorResponse("UNAUTHORIZED", "Unauthorized", 401);
      // return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  } catch (err) {
    // Catch **any unexpected error**
    return errorResponse(
      err.code || "UNAUTHORIZED",
      err.message || "Unauthorized",
      401,
    );
  }
}
