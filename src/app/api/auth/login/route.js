import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { signAccessToken, signRefreshToken } from "@/lib/jwt";
import { setAuthCookies } from "@/lib/cookies";
import { getUserCollection, getRefreshTokensCollection } from "@/lib/mongodb";
import crypto from "crypto";
import { hashToken } from "@/utils/tokens";

const ACCESS_COOKIE_NAME = "accessToken";
const REFRESH_COOKIE_NAME = "refreshToken";

const ACCESS_EXPIRES = 6 * 60;
const REFRESH_EXPIRES = 30 * 24 * 3600; // 30 days

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    console.log("handleSubmit-server ********", email, password);
    const users = await getUserCollection();

    const user = await users.findOne({ email });
    if (!user)
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    // if (!user.verified)
    //   return NextResponse.json({ error: "Not verified" }, { status: 401 });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match)
      return NextResponse.json(
        { error: "Invalid credentials-----" },
        { status: 401 }
      );
    const payload = {
      userId: user._id.toString(),
      username: user.username,
      email: user.email,
    };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);
    const hashedToken = hashToken(refreshToken);
    const csrfToken = crypto.randomBytes(24).toString("hex");
    // setAuthCookies(accessToken, refreshToken);

    // Save hashed refresh token in DB
    const tokenscollection = await getRefreshTokensCollection();
    await tokenscollection.updateOne(
      { userId: user._id.toString() },
      {
        $set: {
          refreshToken: refreshToken,
          hashedToken: hashedToken,
          createdAt: new Date(),
          expiresAt: new Date(Date.now() + REFRESH_EXPIRES * 1000),
        },
      },
      { upsert: true }
    );

    // set cookies
    // const res = NextResponse.redirect(
    //   new URL("/pages/dashboard", process.env.API_URL)
    // );
    const res = NextResponse.json({ success: true, user }); //don't sent all user!!!

    res.cookies.set(ACCESS_COOKIE_NAME, accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: Number(ACCESS_EXPIRES) || 300,
    });

    // refresh token as HttpOnly cookie
    res.cookies.set(REFRESH_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      secure: true,
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

  // return NextResponse.json({
  //   user: { email: user.email, username: user.username },
  // });
}
