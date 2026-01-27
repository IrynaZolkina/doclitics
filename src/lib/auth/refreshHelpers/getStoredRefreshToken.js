// lib/refreshHelpers/getStoredRefreshToken.js. ✅ Looks up the token in DB (multi-device safe).
import { getRefreshTokensCollection } from "@/lib/mongodb/mongodb";
import { hashTokenSha256 } from "@/utils/tokens";

export async function getStoredRefreshToken(token) {
  const tokensCollection = await getRefreshTokensCollection();
  const hashed = hashTokenSha256(token);
  const tokenDoc = await tokensCollection.findOne({ hashedToken: hashed });
  return tokenDoc; // null if not found
}
