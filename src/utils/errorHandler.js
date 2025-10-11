import { NextResponse } from "next/server";

export function errorResponse(code, message, status = 400) {
  return NextResponse.json(
    { success: false, error: { code, message } },
    { status }
  );
}
export function successResponse(data = {}, message = "OK", status = 200) {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
    },
    { status }
  );
}
