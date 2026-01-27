// app/api/auth/google/route.js
import { NextResponse } from "next/server";
import { googleAuthUrl } from "@/lib/oauth";
import crypto from "crypto";

export async function GET() {
  const state = crypto.randomBytes(24).toString("hex");
  const res = NextResponse.redirect(googleAuthUrl(state));
  res.cookies.set("oauth_state", state, {
    httpOnly: true,
    //secure: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 300, // 5 minutes
  });

  return res;
  //return NextResponse.redirect(googleAuthUrl());
}
