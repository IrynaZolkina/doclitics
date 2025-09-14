// /api/auth/refresh/route.js
import { NextResponse } from "next/server";
import { verifyRefreshToken, signAccessToken } from "@/lib/jwt";
import clientPromise, { getRefreshTokensCollection } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req) {
  const refreshToken = req.cookies.get("refreshToken")?.value;
  console.log("Refresh token:------------ ", refreshToken);
  if (!refreshToken) {
    return NextResponse.json({ error: "No refresh token" }, { status: 401 });
  }

  try {
    // 1. Verify refresh token
    const payload = verifyRefreshToken(refreshToken);
    console.log("Refresh token payload:-------------------- ", payload);
    if (!payload) {
      return NextResponse.json(
        { error: "Invalid refresh token" },
        { status: 401 }
      );
    }
    const tokenscollection = await getRefreshTokensCollection();
    // const client = await clientPromise;
    // const db = client.db("your-db");
    // const tokens = db.collection("tokens");

    // make sure refresh token is in DB (not revoked)
    const stored = await tokenscollection.findOne({
      // userId: payload.userId,
      userId: new ObjectId(payload.userId),
    });
    console.log(
      "Stored refresh token фдд гыук from DB:-------------------- ",
      stored
    );
    if (!stored || stored.refreshToken !== refreshToken) {
      return NextResponse.json(
        { error: "Refresh token revoked" },
        { status: 401 }
      );
    }
    const newPayload = {
      // userId: payload.userId,
      userId: new ObjectId(payload.userId),
      username: payload.username,
      // id: payload.userId,
      email: payload.email,
    };
    console.log("newPayLoad--------", newPayload);

    // issue new access token
    const newAccessToken = signAccessToken(newPayload);
    // const payload = {
    //     userId: user._id,
    //     username: user.username,
    //     email: user.email,
    //   };

    const res = NextResponse.json({ message: "Access token refreshed" });
    res.cookies.set("accessToken", newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 6, // 15 min
      path: "/",
    });

    return res;
  } catch (err) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
