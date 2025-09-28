import { NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/jwt";
import { getUserCollection } from "@/lib/mongodb";
import { errorResponse } from "@/utils/apiFetch";

export async function GET(req) {
  const token = req.cookies.get("accessToken")?.value;

  const csrfHeader = req.headers.get("x-csrf-token");
  const csrfCookie = req.cookies.get("csrfToken")?.value;

  console.log("csrfHeader----", csrfHeader, "csrfCookie----", csrfCookie);

  // CSRF check
  if (!csrfHeader || csrfHeader !== csrfCookie)
    return errorResponse("CSRF_MISMATCH", "CSRF mismatch. Not authorized", 403);

  if (!token) return errorResponse("NO_TOKEN", "No token. Not authorized", 401);

  try {
    const payload = verifyAccessToken(token);
    console.log("Access token payload:-------------------- ", payload);
    if (!payload) {
      return errorResponse(
        "INVALID_TOKEN",
        "Access Token Invalid token. Not authorized",
        401
      );
    }

    const users = await getUserCollection();
    const user = await users.findOne({ email: payload.email });
    console.log("User from DB:-------------------- ", user);
    if (!user) {
      if (!user)
        return errorResponse(
          "USER_NOT_FOUND",
          "User not found. Not authorized",
          404
        );
    }
    return NextResponse.json(
      { success: true, data: { user } },
      { status: 200 }
    );
  } catch (err) {
    return errorResponse(
      "INVALID_TOKEN",
      "Invalid token. Token verification failed",
      401
    );
  }
}

// return NextResponse.json({
//   user: {
//     id: user._id,
//     username: user.username,
//     email: user.email,
//     picture: user.picture ? user.picture : "",
//     category: user.category,
//   },
// });
