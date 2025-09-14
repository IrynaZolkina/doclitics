// app/api/auth/google/route.js
import { NextResponse } from "next/server";
import { googleAuthUrl } from "@/lib/oauth";

export async function GET() {
  return NextResponse.redirect(googleAuthUrl());
}
