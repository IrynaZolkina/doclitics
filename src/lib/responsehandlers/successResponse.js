import { NextResponse } from "next/server";

export function successResponse(data = null, message = "OK", status = 200) {
  return NextResponse.json(
    {
      success: true,
      ...(message && { message }),
      ...(data !== null && { data }),
    },
    { status },
  );
}
/******************************************** */
// 🧠 Why this is better
// Case	Output
// successResponse()	{ success: true, message: "OK" }
// successResponse(null, "Logged out")	{ success: true, message: "Logged out" }
// successResponse({ user })	{ success: true, message: "OK", data: { user } }
// successResponse(null, null, 204)	{ success: true }

// No fake data. No noise.

// 🔥 Real usage examples
// Create user
// return successResponse(
//   { user },
//   "User created successfully",
//   201,
// );

// Delete resource
// return successResponse(
//   null,
//   "Project deleted",
//   200,
// );

// Logout
// return successResponse(
//   null,
//   "Logged out",
// );
