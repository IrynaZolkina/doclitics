// src/app/api/summary/route.js
import { NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/jwt";
import {
  getPendingUserCollection,
  getVerificationCollection,
} from "@/lib/mongodb";

export async function GET(req) {
  const token = req.cookies.get("accessToken")?.value;
  console.log("Summary ACCESS. token:;;;;;;;;;;;;;;;;;;;", token);

  // Create TTL index (safe to run multiple times)
  // const collection = await getPendingUserCollection();
  // await collection.createIndex(
  //   { createdAt: 1 },
  //   { expireAfterSeconds: 600 } // 10 minutes
  // );

  // console.log("TTL index created!");

  // Create TTL index (safe to run multiple times)
  // const collection = await getVerificationCollection();
  // await collection.createIndex(
  //   { createdAt: 1 },
  //   { expireAfterSeconds: 600 } // 10 minutes
  // );

  // console.log("TTL index created!");

  if (!token) {
    return NextResponse.json(
      { error: "No token. User not authorizeds" },
      { status: 401 }
    );
  }

  const payload = verifyAccessToken(token);

  if (!payload) {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 401 }
    );
  }

  // ✅ user is authenticated
  return NextResponse.json({
    message: "Here is your summary",
    userId: payload.id,
    email: payload.email,
  });
}
