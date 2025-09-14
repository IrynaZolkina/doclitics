import { NextResponse } from "next/server";
import { getGoogleAuthURL } from "@/lib/google/serverutils";

export async function GET() {
  const authUrl = getGoogleAuthURL();

  return NextResponse.json({ authUrl });
}
