// lib/refreshHelpers/revokeAllUserSessions.js.  ✅ Deletes all refresh tokens for a user.
import { getRefreshTokensCollection } from "@/lib/mongodb/mongodb";

export async function revokeAllUserSessions(userId) {
  const tokensCollection = await getRefreshTokensCollection();
  await tokensCollection.deleteMany({ userId });
}
