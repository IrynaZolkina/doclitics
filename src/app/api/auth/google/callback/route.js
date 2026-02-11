// app/api/auth/google/callback/route.js
import { NextResponse } from "next/server";
import {
  getRefreshTokensCollection,
  getUserCollection,
} from "@/lib/mongodb/mongodb";
import { exchangeCodeForTokens, fetchGoogleUser } from "@/lib/oauth";
import { signAccessToken, signRefreshToken } from "@/lib/jwt";

import crypto from "crypto";
import { hashTokenSha256 } from "@/lib/tokens";
import { createUser } from "@/lib/mongodb/createUser";

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

export async function GET(req) {
  const url = new URL(req.url);
  const state = url.searchParams.get("state");
  const cookieState = req.cookies.get("oauth_state")?.value;

  if (!state || !cookieState || state !== cookieState) {
    return NextResponse.redirect(
      new URL("/login?error=state", process.env.API_URL),
    );
  }
  try {
    const code = url.searchParams.get("code");
    if (!code)
      return NextResponse.redirect(
        new URL("/login?error=oauth", process.env.API_URL),
      );

    const tokens = await exchangeCodeForTokens(code);
    const profile = await fetchGoogleUser(tokens.access_token);
    if (!profile.email || profile.email_verified !== true) {
      return NextResponse.redirect(
        new URL("/login?error=email", process.env.API_URL),
      );
    }
    //console.log("profiel---------------------", profile);

    const users = await getUserCollection();

    let user = await users.findOne({ email: profile.email });
    if (!user) {
      // const newUser = {
      //   email: profile.email,
      //   username: profile.name || "",
      //   googleId: profile.sub,
      //   category: "no",
      //   picture: profile.picture,
      //   createdAt: new Date(),
      //   updatedAt: new Date(),
      // };
      // const r = await users.insertOne(newUser);
      // user = { ...newUser, _id: r.insertedId };
      user = await createUser({
        email: profile.email,
        username: profile.name || "",
        provider: "google",
        googleId: profile.sub,
        picture: profile.picture,
        verified: true,
      });
    } else {
      // If no googleId present, update it and mark verified
      const update = {};
      if (!user.googleId) update.googleId = profile.sub;
      if (!user.verified) update.verified = true;
      if (Object.keys(update).length) {
        update.updatedAt = new Date();
        await users.updateOne({ _id: user._id }, { $set: update });
      }
    }

    // ── TOKENS ─────────────────────────────
    // create tokens
    const payload = {
      userId: user._id.toString(),
      username: user.username,
      email: user.email,
    };
    // const userInfo = {
    //   username: user.username,
    //   email: user.email,
    // };
    const tokenscollection = await getRefreshTokensCollection();

    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);
    const hashedToken = hashTokenSha256(refreshToken);
    const csrfToken = crypto.randomBytes(24).toString("hex");
    //console.log("Generated tokens for userId:------", payload, refreshToken);

    // 4. Insert new refresh token (multi-device)
    await tokenscollection.insertOne({
      userId: user._id.toString(),
      hashedToken: hashedToken,
      createdAt: new Date(),
      updatedAt: new Date(),
      expiresAt: new Date(Date.now() + refreshTokenExpiryMs), // 20 days
    });

    const res = NextResponse.redirect(new URL("/", process.env.API_URL));

    res.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      //secure: true,
      secure: process.env.NODE_ENV === "production",
      //sameSite: "strict",
      sameSite: "lax",
      path: "/",
      maxAge: accessTokenCookieMaxAge,
    });

    // refresh token as HttpOnly cookie
    res.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      //secure: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",

      //sameSite: "strict",
      path: "/",
      maxAge: refreshTokenCookieMaxAge,
    });
    res.cookies.set("csrfToken", csrfToken, {
      httpOnly: false,
      secure: true,
      sameSite: "lax",
      //sameSite: "strict",
      path: "/",
    });
    res.cookies.set("oauth_state", "", {
      maxAge: 0,
      path: "/",
    });
    return res;
  } catch (err) {
    console.error("Google callback error:", err);
    return NextResponse.redirect(
      new URL("/login?error=oauth", process.env.API_URL),
    );
  }
}
