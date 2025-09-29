// src/app/api/auth/logout/route.js
import { NextResponse } from "next/server";
import clientPromise, { getRefreshTokensCollection } from "@/lib/mongodb"; // your Mongo client
import { verifyRefreshToken } from "@/lib/jwt";
import { hashTokenSha256, verifyRefreshTokenHashed } from "@/utils/tokens";

export async function POST(req) {
  try {
    // 1. Get refreshToken from cookies
    const refreshToken = req.cookies.get("refreshToken")?.value;
    console.log("Logout refresh token:??????????????????? ", refreshToken);

    if (!refreshToken) {
      return NextResponse.json({ error: "No refresh token" }, { status: 400 });
    }
    const tokensCollection = await getRefreshTokensCollection();
    const hashedToken = hashTokenSha256(refreshToken);

    // Delete only this device/session
    await tokensCollection.deleteOne({ hashedToken });

    // const payload = verifyRefreshToken(refreshToken);
    // console.log(
    //   "Logout refresh token payload:........../////////......... ",
    //   payload
    // );
    // const veryfied = await verifyRefreshTokenHashed(
    //   payload.userId,
    //   refreshToken
    // );
    // console.log(
    //   "L&&&&&&&&&&&&&&&&&&&&&&&&:................... ",

    //   veryfied
    // );
    // 2. Remove refresh token from DB

    // const tokenscollection = await getRefreshTokensCollection();

    const res = NextResponse.json({ message: "Logged out" });
    // await tokenscollection.deleteOne({
    //   userId: payload.userId, //string
    // });
    // 3. Clear cookies
    res.cookies.set("accessToken", "", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      expires: new Date(0),
      path: "/",
    });

    res.cookies.set("refreshToken", "", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      expires: new Date(0),
      path: "/",
    });
    res.cookies.set("csrfToken", "", {
      httpOnly: false,
      secure: true,
      sameSite: "strict",
      expires: new Date(0),
      path: "/",
    });
    return res;
  } catch (err) {
    console.error("Failed to delete refresh token", err.message);
  }
}

// export async function POST() {
//   const res = NextResponse.json({ message: "Logged out" });
//   ["accessToken", "refreshToken", "csrfToken"].forEach((c) =>
//     res.cookies.set(c, "", { httpOnly: true, secure: true, expires: new Date(0), path: "/" })
//   );
//   return res;
// }
