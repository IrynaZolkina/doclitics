import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { getCollection } from "@/lib/db";

const ACCESS_EXPIRES = 900; // 15 min
const REFRESH_EXPIRES = 30 * 24 * 3600; // 30 days

function createAccessToken(payload) {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: `${ACCESS_EXPIRES}s`,
  });
}

export async function POST(req) {
  try {
    const cookie = req.headers.get("cookie") || "";
    const match = cookie.match(/refreshToken=([^;]+)/);
    if (!match)
      return NextResponse.json({ error: "No refresh cookie" }, { status: 401 });
    const refreshPlain = match[1];

    // const db = await getDb();
    const refreshs = await getCollection("refreshTokens");

    const row = await refreshs.findOne({});
    if (!row)
      return NextResponse.json(
        { error: "Invalid refresh token" },
        { status: 401 }
      );

    const valid = await bcrypt.compare(refreshPlain, row.tokenHash);
    if (!valid)
      return NextResponse.json(
        { error: "Invalid refresh token" },
        { status: 401 }
      );
    if (new Date() > new Date(row.expiresAt))
      return NextResponse.json(
        { error: "Expired refresh token" },
        { status: 401 }
      );

    // Get user
    const users = await getCollection("users");
    const user = await users.findOne({ _id: row.userId });
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 401 });

    // Create new access token
    const accessToken = createAccessToken({
      userId: user._id.toString(),
      email: user.email,
    });

    // 🔄 Rotate refresh token
    const newRefreshPlain = crypto.randomBytes(64).toString("hex");
    const newRefreshHash = await bcrypt.hash(newRefreshPlain, 10);

    await refreshs.updateOne(
      { userId: user._id },
      {
        $set: {
          tokenHash: newRefreshHash,
          createdAt: new Date(),
          expiresAt: new Date(Date.now() + REFRESH_EXPIRES * 1000),
        },
      }
    );

    // Set new refresh cookie
    const cookieParts = [
      `refreshToken=${newRefreshPlain}`,
      `Max-Age=${REFRESH_EXPIRES}`,
      `Path=/`,
      `HttpOnly`,
      `SameSite=Lax`,
    ];
    if (process.env.NODE_ENV === "production") cookieParts.push("Secure");

    const res = NextResponse.json({ accessToken, username: user.name });
    res.headers.set("Set-Cookie", cookieParts.join("; "));
    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
