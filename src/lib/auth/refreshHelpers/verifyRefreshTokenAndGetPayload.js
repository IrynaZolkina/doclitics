// lib/refreshHelpers/verifyRefreshTokenAndGetPayload.js
import { verifyRefreshToken } from "@/lib/jwt";

export function verifyRefreshTokenAndGetPayload(token) {
  try {
    const payload = verifyRefreshToken(token);
    if (!payload) throw new Error("Invalid refresh token");
    return payload;
  } catch (err) {
    throw { code: "INVALID_TOKEN", message: "Invalid refresh token" };
  }
}
