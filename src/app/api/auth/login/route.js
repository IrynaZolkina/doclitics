import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { generateAccessToken, generateRefreshToken } from "@/lib/jwt";
import { setAuthCookies } from "@/lib/cookies";
import { getUserCollection, getRefreshTokensCollection } from "@/lib/mongodb";
import crypto from "crypto";
import { hashTokenSha256 } from "@/utils/tokens";
import { errorResponse } from "@/utils/apiFetch";

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

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    console.log("handleSubmit-server ********", email, password);
    const usersCollection = await getUserCollection();
    const tokensCollection = await getRefreshTokensCollection();

    // 1. Find user
    const user = await usersCollection.findOne({ email });
    if (!user)
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    // 2. Check password (skip for Google OAuth users)
    if (user.googleId) {
      // ❌ User signed up with Google, so password login is not allowed
      return NextResponse.json(
        {
          error:
            "This account was created with Google. Please log in using Google.",
        },
        { status: 400 }
      );
    } else {
      // Normal email/password login
      const isValid = await bcrypt.compare(password, user.passwordHash);
      if (!isValid) {
        return NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 }
        );
      }
    }
    // 3. Generate tokens
    const payload = {
      userId: user._id.toString(),
      username: user.username,
      email: user.email,
    };
    const userInfo = {
      username: user.username,
      email: user.email,
    };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    const hashedToken = hashTokenSha256(refreshToken);
    const csrfToken = crypto.randomBytes(24).toString("hex");

    // 4. Insert new refresh token (multi-device)
    await tokensCollection.insertOne({
      userId: user._id.toString(),
      hashedToken: hashedToken,
      createdAt: new Date(),
      updatedAt: new Date(),
      expiresAt: new Date(Date.now() + refreshTokenExpiryMs), // 20 days
    });

    // // setAuthCookies(accessToken, refreshToken);

    // // Save hashed refresh token in DB
    // await tokensCollection.updateOne(
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

    // const user = await users.findOne(
    //       { email: payload.email },
    //       {
    //         projection: {
    //           _id: 0,          // hide MongoDB _id
    //           username: 1,
    //           email: 1,
    //           category: 1,
    //           picture: 1,
    //         },
    //       }
    //     );

    // set cookies
    // const res = NextResponse.redirect(
    //   new URL("/pages/dashboard", process.env.API_URL)
    // );
    const res = NextResponse.json({ success: true, userInfo }); //don't sent all user!!!

    res.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: accessTokenCookieMaxAge,
    });

    // refresh token as HttpOnly cookie
    res.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: refreshTokenCookieMaxAge,
    });
    res.cookies.set("csrfToken", csrfToken, {
      httpOnly: false,
      secure: true,
      sameSite: "strict",
      path: "/",
    });

    return res;
  } catch (err) {
    console.error("Login error:", err);
    return errorResponse("LOGIN_FAILED", "Login failed", 500);
  }

  // return NextResponse.json({
  //   user: { email: user.email, username: user.username },
  // });
}
