import { NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/jwt";
import { getUserCollection } from "@/lib/mongodb";

export async function GET(req) {
  const token = req.cookies.get("accessToken")?.value;
  if (!token)
    return NextResponse.json(
      { error: "No token. Not authorized" },
      { status: 401 }
    );

  const payload = verifyAccessToken(token);
  if (!payload)
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  const users = await getUserCollection();
  const user = await users.findOne({ email: payload.email });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      picture: user.picture ? user.picture : "",
      category: user.category,
    },
  });
}
