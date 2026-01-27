import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { success: false, data: { user: null } },
      { status: 200 }
    );
  }

  return NextResponse.json({ success: true, data: { user } }, { status: 200 });
}
