import { signRefreshToken } from "@/lib/jwt";
import { getRefreshTokensCollection } from "@/lib/mongodb";
import crypto from "crypto";

// Hash function (SHA-256)
export function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function saveRefreshToken(userId, token) {
  const hashed = hashToken(token);

  // Store in DB: userId + hashedToken
  const tokenscollection = await getRefreshTokensCollection();
  await tokenscollection.updateOne(
    { userId },
    { $set: { token: hashed, createdAt: new Date() } },
    { upsert: true }
  );
}

export async function verifyRefreshTokenHashed(userId, token) {
  const hashed = hashToken(token);

  const tokenscollection = await getRefreshTokensCollection();
  const stored = await tokenscollection.findOne({ userId: userId });
  if (!stored) return false;
  return stored.hashedToken === hashed;
}

export async function rotateRefreshToken(userId, payload) {
  const newRefreshToken = signRefreshToken(payload);

  await saveRefreshToken(userId, newRefreshToken);

  return newRefreshToken;
}

export async function removeRefreshToken(userId) {
  const tokenscollection = await getRefreshTokensCollection();
  await tokenscollection.deleteOne({ userId });
}
