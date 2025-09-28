import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { errorResponse } from "@/utils/apiFetch";

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;

export async function GET() {
  const token = req.cookies.get("accessToken")?.value;
  const csrfHeader = req.headers.get("x-csrf-token");
  const csrfCookie = req.cookies.get("csrfToken")?.value;

  // CSRF check
  if (!csrfHeader || csrfHeader !== csrfCookie)
    return errorResponse("CSRF_MISMATCH", "CSRF mismatch. Not authorized", 403);

  if (!token) return errorResponse("NO_TOKEN", "No token. Not authorized", 401);

  try {
    const user = jwt.verify(token, JWT_ACCESS_SECRET);
    return NextResponse.json({ message: "Protected content", user });
  } catch {
    return NextResponse.json(
      { error: "Token invalid or expired" },
      { status: 403 }
    );
  }
}
