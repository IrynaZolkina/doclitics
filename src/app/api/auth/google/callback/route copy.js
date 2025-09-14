import { getCollection } from "@/lib/db";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import bcrypt from "bcrypt";

const ACCESS_EXPIRES = 900; // 15 min
const REFRESH_EXPIRES = 30 * 24 * 3600; // 30 days

function createAccessToken(payload) {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: `${ACCESS_EXPIRES}s`,
  });
}

export async function GET(req) {
  try {
    //   const code = req.nextUrl.searchParams.get("code");

    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    if (!code) {
      return NextResponse.json({ error: "No code" }, { status: 400 });
    }

    // 1. Exchange code → tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code",
      }),
    });
    const tokens = await tokenRes.json();
    if (!tokens.access_token)
      return NextResponse.json(
        { error: "Token exchange failed" },
        { status: 500 }
      );

    // 2. Get user info
    const userRes = await fetch(
      "https://openidconnect.googleapis.com/v1/userinfo",
      {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      }
    );
    const profile = await userRes.json();
    console.log("Google profile-----------", profile);

    // 3️⃣ Upsert user in MongoDB
    // const db = await getDb();
    const users = await getCollection("users");

    const userDoc = {
      googleId: profile.sub,
      email: profile.email,
      name: profile.name,
      picture: profile.picture,
      updatedAt: new Date(),
    };
    const result = await users.findOneAndUpdate(
      { email: profile.email },
      { $set: userDoc, $setOnInsert: { createdAt: new Date() } },
      { upsert: true, returnDocument: "after" }
    );
    // const user = result.value;
    const user = result;

    console.log("User:", user);
    // 4️⃣ Create access token
    const accessToken = createAccessToken({
      userId: user._id.toString(),
      email: user.email,
    });

    // 5️⃣ Create refresh token
    const refreshTokenPlain = crypto.randomBytes(64).toString("hex");
    const refreshTokenHash = await bcrypt.hash(refreshTokenPlain, 10);

    // Save hashed refresh token in DB
    const refreshs = await getCollection("refreshTokens");
    await refreshs.updateOne(
      { userId: user._id },
      {
        $set: {
          tokenHash: refreshTokenHash,
          createdAt: new Date(),
          expiresAt: new Date(Date.now() + REFRESH_EXPIRES * 1000),
        },
      },
      { upsert: true }
    );

    // 6️⃣ Set refresh token cookie
    const cookieParts = [
      `refreshToken=${refreshTokenPlain}`,
      `Max-Age=${REFRESH_EXPIRES}`,
      `Path=/`,
      `HttpOnly`,
      `SameSite=Lax`,
    ];
    if (process.env.NODE_ENV === "production") cookieParts.push("Secure");

    // const res = NextResponse.json({ accessToken, username: user.name });
    // res.headers.set("Set-Cookie", cookieParts.join("; "));
    // inside your Google callback after creating tokens

    // const userPayload = encodeURIComponent(
    //   JSON.stringify({
    //     id: user._id.toString(),
    //     email: user.email,
    //     name: user.name,
    //   })
    // );
    // console.log("User payload:*************************", userPayload);
    // const redirectUrl = `${process.env.API_URL}/pages/auth/callback#access=${accessToken}&user=${userPayload}`;
    // const res = NextResponse.redirect(redirectUrl);

    // // set refreshToken cookie on the redirect response
    // res.headers.set("Set-Cookie", cookieParts.join("; "));
    // return res;

    // const userPayload = encodeURIComponent(
    //   JSON.stringify({
    //     id: user._id.toString(),
    //     email: user.email,
    //     name: user.name,
    //   })
    // );

    // // Build absolute URL from the request
    // const baseUrl = `${req.nextUrl.protocol}//${req.nextUrl.host}`;
    // const redirectUrl = `${baseUrl}/pages/auth/callback#access=${accessToken}&user=${userPayload}`;

    // const res = NextResponse.redirect(redirectUrl);
    // res.headers.set("Set-Cookie", cookieParts.join("; "));

    // const baseUrl = `${req.nextUrl.protocol}//${req.nextUrl.host}`;
    // const res = NextResponse.redirect(baseUrl + "/"); // redirect straight to main page
    // res.headers.set("Set-Cookie", cookieParts.join("; "));

    const baseUrl = `${req.nextUrl.protocol}//${req.nextUrl.host}`;
    const res = NextResponse.redirect(baseUrl + "/");
    res.headers.set("Set-Cookie", cookieParts.join("; "));

    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
    // return NextResponse.redirect(redirectToFrontend);
  }
}

// 3. Later: mint your own JWT + cookie
//   return NextResponse.json({ profile });
// }
