// lib/auth.js
import { verifyAccessToken, verifyRefreshToken } from "@/lib/jwt";
import { getUserCollection } from "@/lib/mongodb/mongodb";

export async function getUserFromToken(token) {
  const payload = verifyRefreshToken(token);
  // console.log("--------------getUserFromToken payload:", payload);
  // const payload = verifyAccessToken(token);
  if (!payload) return null;

  const users = await getUserCollection();
  const user = await users.findOne({ email: payload.email });
  return { user, payload };
}
