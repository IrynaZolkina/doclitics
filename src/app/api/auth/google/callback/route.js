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

const ACCESS_COOKIE_NAME = "accessToken";
const REFRESH_COOKIE_NAME = "refreshToken";

const ACCESS_EXPIRES = 6 * 60;
const REFRESH_EXPIRES = 30 * 24 * 3600; // 30 days

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
        verified: true,
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
    // create tokens
    const payload = {
      userId: user._id,
      username: user.username,
      email: user.email,
    };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);
    const csrfToken = crypto.randomBytes(24).toString("hex");
    console.log("Generated tokens for userId:------", payload, refreshToken);
    // Save refresh token in DB
    const tokenscollection = await getRefreshTokensCollection();
    await tokenscollection.updateOne(
      { userId: user._id },
      {
        $set: {
          refreshToken: refreshToken,
          createdAt: new Date(),
          expiresAt: new Date(Date.now() + REFRESH_EXPIRES * 1000),
        },
      },
      { upsert: true }
    );
    // set cookies
    const res = NextResponse.redirect(
      new URL("/pages/auth/login", process.env.API_URL)
    );

    // access token as non-httpOnly cookie so client JS can read and hydrate Redux
    res.cookies.set(ACCESS_COOKIE_NAME, accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: Number(ACCESS_EXPIRES) || 300,
    });

    // refresh token as HttpOnly cookie
    res.cookies.set(REFRESH_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: Number(REFRESH_EXPIRES) || 1209600,
    });
    res.cookies.set("csrfToken", csrfToken, {
      httpOnly: false,
      secure: true,
      sameSite: "strict",
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
