// lib/refreshHelpers/rotateRefreshToken.js. ✅ Creates new access + refresh tokens, updates DB, returns tokens + cookie info.
import { signAccessToken, signRefreshToken } from "@/lib/jwt";
import { hashTokenSha256 } from "@/lib/tokens";
import { getRefreshTokensCollection } from "@/lib/mongodb/mongodb";

const REFRESH_TOKEN_DAYS = parseInt(process.env.REFRESH_TOKEN_DAYS || "20", 10);
const ACCESS_TOKEN_MINUTES = parseInt(
  process.env.ACCESS_TOKEN_MINUTES || "6",
  10,
);

const refreshTokenExpiryMs = REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000;
const accessTokenCookieMaxAge = (ACCESS_TOKEN_MINUTES + 1) * 60;
const refreshTokenCookieMaxAge = REFRESH_TOKEN_DAYS * 24 * 60 * 60;

export async function rotateRefreshToken(tokenDoc, payload) {
  const newAccessToken = signAccessToken({
    userId: payload.userId,
    username: payload.username,
    email: payload.email,
  });

  const newRefreshToken = signRefreshToken({
    userId: payload.userId,
    username: payload.username,
    email: payload.email,
  });

  const hashed = hashTokenSha256(newRefreshToken);
  const now = new Date();
  const expires = new Date(now.getTime() + refreshTokenExpiryMs);

  const tokensCollection = await getRefreshTokensCollection();
  await tokensCollection.updateOne(
    { _id: tokenDoc._id },
    { $set: { hashedToken: hashed, updatedAt: now, expiresAt: expires } },
    { upsert: true },
  );

  return {
    newAccessToken,
    newRefreshToken,
    accessTokenCookieMaxAge,
    refreshTokenCookieMaxAge,
  };
}
