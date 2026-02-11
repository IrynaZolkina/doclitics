import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { generateAccessToken, generateRefreshToken } from "@/lib/jwt";
import { setAuthCookies } from "@/lib/cookies";
import {
  getUserCollection,
  getRefreshTokensCollection,
} from "@/lib/mongodb/mongodb";
import crypto from "crypto";
import { hashTokenSha256 } from "@/lib/tokens";
import { errorResponse } from "@/lib/responsehandlers/errorResponse";

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
    const { email, password } = await req.json();
    console.log("handleSubmit-server ********", email, password);
    const usersCollection = await getUserCollection();
    const tokensCollection = await getRefreshTokensCollection();

    // 1. Find user
    const user = await usersCollection.findOne({ email: email.toLowerCase() });
    if (!user)
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    // 2. Check password (skip for Google OAuth users)
    if (user.googleId) {
      // ❌ User signed up with Google, so password login is not allowed
      return NextResponse.json(
        {
          error:
            "This account was created with Google. Please log in using Google.",
        },
        { status: 400 },
      );
    } else {
      // Normal email/password login
      const isValid = await bcrypt.compare(password, user.passwordHash);
      if (!isValid) {
        return NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 },
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
      userId: user._id,
      username: user.username,
      email: user.email,
      hasStripeCustomer: user.stripeCustomerId ? true : false,
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

    const res = NextResponse.json({ success: true, userInfo }); //don't sent all user!!!

    res.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      //secure: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: accessTokenCookieMaxAge,
    });

    // refresh token as HttpOnly cookie
    res.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      //secure: true,
      secure: process.env.NODE_ENV === "production",
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
