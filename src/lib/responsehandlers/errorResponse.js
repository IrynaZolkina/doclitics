import { NextResponse } from "next/server";

export function errorResponse(code, message, status = 400, details = null) {
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message: typeof message === "string" ? message : "Unexpected error",
        ...(details && { details }),
      },
    },
    { status },
  );
}

/****************************** */
// 🔧 Scenario

// User tries to update their profile, but the email is already taken.

// API route (server)
// if (existingUser) {
//   return errorResponse(
//     "EMAIL_ALREADY_IN_USE",
//     "This email is already associated with another account.",
//     409,
//     {
//       field: "email",
//       value: email,
//       suggestion: "Use a different email or log in instead",
//     },
//   );
// }

// 📦 JSON response sent to the client
// {
//   "success": false,
//   "error": {
//     "code": "EMAIL_ALREADY_IN_USE",
//     "message": "This email is already associated with another account.",
//     "details": {
//       "field": "email",
//       "value": "user@example.com",
//       "suggestion": "Use a different email or log in instead"
//     }
//   }
// }

// 🎨 Frontend usage example (React)
// const res = await fetch("/api/user/update", { method: "POST" });
// const data = await res.json();

// if (!data.success) {
//   const { message, details } = data.error;

//   toast.error(message);

//   if (details?.field) {
//     setFieldError(details.field, details.suggestion);
//   }
// }
