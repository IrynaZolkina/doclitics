import { NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/jwt";
import { getUserCollection } from "@/lib/mongodb/mongodb";
import { errorResponse } from "@/lib/responsehandlers/errorResponse";
import { getCsrfTokens, validateCsrf } from "@/lib/auth/csrf";
import { getUserFromToken } from "@/lib/auth/getUserFromToken";
// import { errorResponse } from "@/utils/apiFetch";

export async function GET(req) {
  try {
    console.log("/api/auth/me------- 1");
    const { csrfHeader, csrfCookie } = getCsrfTokens(req);
    validateCsrf(csrfHeader, csrfCookie);
    console.log("/api/auth/me------- 2");
    const token = req.cookies.get("accessToken")?.value;
    if (!token)
      return errorResponse("NO_TOKEN", "No token. Not authorized", 401);
    console.log("/api/auth/me------- 3");

    const { user, userSummaries, payload } = await getUserFromToken(token);
    console.log("/api/auth/me------- 4 -sum", userSummaries);
    if (!user) return errorResponse("USER_NOT_FOUND", "User not found", 404);

    return NextResponse.json(
      { success: true, data: { user, userSummaries } },
      { status: 200 },
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
