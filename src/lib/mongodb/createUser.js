// lib/auth/createUser.js
import { getUserCollection } from "@/lib/mongodb/mongodb";

/**
 * Create a user in main users collection.
 * @param {object} data - User data (email, username, passwordHash, etc.)
 * @param {boolean} insertToUsers - If false, just returns user object without inserting
 */
export async function createUser(data, insertToUsers = true) {
  const users = await getUserCollection();
  const now = new Date();

  const userDoc = {
    email: data.email.toLowerCase(),
    username: data.username || "",
    passwordHash: data.passwordHash || null,
    provider: data.provider || "local",
    googleId: data.googleId || null,
    picture: data.picture || null,
    verified: data.verified ?? false,

    plan: data.plan || "no",
    subscriptionStatus: data.subscriptionStatus || "passive",
    stripeCustomerId: data.stripeCustomerId || null,
    stripeSubscriptionId: data.stripeSubscriptionId || null,
    docsAmount: data.docsAmount || 0,

    createdAt: now,
    updatedAt: now,
  };

  if (!insertToUsers) return userDoc;

  const { insertedId } = await users.insertOne(userDoc);
  return { ...userDoc, _id: insertedId };
}
