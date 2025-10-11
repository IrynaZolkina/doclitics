// app/api/auth/google/callback/route.js
import { NextResponse } from "next/server";
import clientPromise, {
  getRefreshTokensCollection,
  getUserCollection,
} from "@/lib/mongodb";
import { exchangeCodeForTokens, fetchGoogleUser } from "@/lib/oauth";
import { signAccessToken, signRefreshToken } from "@/lib/jwt";
import { ObjectId } from "mongodb";
import crypto from "crypto";
import { hashTokenSha256 } from "@/utils/tokens";

// Load from env with defaults
const ACCESS_TOKEN_MINUTES = parseInt(
  process.env.ACCESS_TOKEN_MINUTES || "6",
  10
);
const REFRESH_TOKEN_DAYS = parseInt(process.env.REFRESH_TOKEN_DAYS || "20", 10);

// Access token expiry
const accessTokenExpirySeconds = ACCESS_TOKEN_MINUTES * 60; // for JWT sign
const accessTokenCookieMaxAge = (ACCESS_TOKEN_MINUTES + 1) * 60; // +1 minute

// Refresh token expiry
const refreshTokenExpiryMs = REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000;
const refreshTokenCookieMaxAge = REFRESH_TOKEN_DAYS * 24 * 60 * 60; // in seconds for cookies

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    if (!code)
      return NextResponse.redirect(
        new URL("/login?error=oauth", process.env.API_URL)
      );

    const tokens = await exchangeCodeForTokens(code);
    const profile = await fetchGoogleUser(tokens.access_token);
    console.log("profiel---------------------", profile);
    // upsert user in MongoDB (driver)
    // const client = await clientPromise;
    // const db = client.db(process.env.MONGODB_DB);
    const users = await getUserCollection();

    let user = await users.findOne({ email: profile.email });
    if (!user) {
      const newUser = {
        email: profile.email,
        username: profile.name || "",
        googleId: profile.sub,
        category: "free",
        picture: profile.picture,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const r = await users.insertOne(newUser);
      user = { ...newUser, _id: r.insertedId };
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

    const tokenscollection = await getRefreshTokensCollection();

    // create tokens
    const payload = {
      userId: user._id.toString(),
      username: user.username,
      email: user.email,
    };
    const userInfo = {
      username: user.username,
      email: user.email,
    };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);
    const hashedToken = hashTokenSha256(refreshToken);
    const csrfToken = crypto.randomBytes(24).toString("hex");
    console.log("Generated tokens for userId:------", payload, refreshToken);

    // 4. Insert new refresh token (multi-device)
    await tokenscollection.insertOne({
      userId: user._id.toString(),
      hashedToken: hashedToken,
      createdAt: new Date(),
      updatedAt: new Date(),
      expiresAt: new Date(Date.now() + refreshTokenExpiryMs), // 20 days
    });

    // Save refresh token in DB
    // await tokenscollection.updateOne(
    //   { userId: user._id.toString() },
    //   {
    //     $set: {
    //       refreshToken: refreshToken,
    //       hashedToken: hashedToken,
    //       createdAt: new Date(),

    //       expiresAt: new Date(Date.now() + REFRESH_EXPIRES * 1000),
    //     },
    //   },
    //   { upsert: true }
    // );
    // set cookies
    const res = NextResponse.redirect(
      new URL("/api/auth/login/success", process.env.API_URL)
    );
    // const res = NextResponse.json({ success: true, userInfo });
    // access token as non-httpOnly cookie so client JS can read and hydrate Redux
    res.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      //sameSite: "strict",
      sameSite: "lax",
      path: "/",
      maxAge: accessTokenCookieMaxAge,
    });

    // refresh token as HttpOnly cookie
    res.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
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

    return res;
  } catch (err) {
    console.error("Google callback error:", err);
    return NextResponse.redirect(
      new URL("/pages/login?error=oauth", process.env.API_URL)
    );
  }
}
