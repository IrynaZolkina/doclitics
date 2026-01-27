import { NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/jwt";
import { getUserCollection } from "@/lib/mongodb/mongodb";
import { errorResponse } from "@/utils/errorHandler";
import { getCsrfTokens, validateCsrf } from "@/lib/auth/csrf";
import { getUserFromToken } from "@/lib/auth/getUserFromToken";
// import { errorResponse } from "@/utils/apiFetch";

export async function GET(req) {
  try {
    const { csrfHeader, csrfCookie } = getCsrfTokens(req);
    validateCsrf(csrfHeader, csrfCookie);

    const token = req.cookies.get("accessToken")?.value;
    if (!token)
      return errorResponse("NO_TOKEN", "No token. Not authorized", 401);

    const { user, payload } = await getUserFromToken(token);
    if (!user) return errorResponse("USER_NOT_FOUND", "User not found", 404);

    return NextResponse.json(
      { success: true, data: { user } },
      { status: 200 }
    );
  } catch (err) {
    return errorResponse(err.code || "CSRF_ERROR", err.message, 403);
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
