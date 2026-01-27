// lib/auth/getCurrentUser.js
import {
  verifyAccessToken,
  verifyRefreshToken,
  signAccessToken,
  signRefreshToken,
} from "@/lib/jwt";
import {
  getUserCollection,
  getRefreshTokensCollection,
} from "@/lib/mongodb/mongodb";
import { hashTokenSha256 } from "@/utils/tokens";

const ACCESS_TOKEN_MINUTES = parseInt(
  process.env.ACCESS_TOKEN_MINUTES || "6",
  10
);
const REFRESH_TOKEN_DAYS = parseInt(process.env.REFRESH_TOKEN_DAYS || "20", 10);

const accessTokenCookieMaxAge = (ACCESS_TOKEN_MINUTES + 1) * 60;
const refreshTokenExpiryMs = REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000;
const refreshTokenCookieMaxAge = REFRESH_TOKEN_DAYS * 24 * 60 * 60;

export async function getCurrentUser(req, res) {
  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  if (!accessToken && !refreshToken) return null;

  let payload;

  // 1️⃣ Try access token first
  if (accessToken) {
    try {
      payload = verifyAccessToken(accessToken);
    } catch {
      payload = null;
    }
  }
}
// 2️⃣ If access token invalid
