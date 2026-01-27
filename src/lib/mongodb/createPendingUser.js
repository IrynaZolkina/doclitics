// lib/auth/createPendingUser.js
import { getPendingUsersCollection } from "@/lib/mongodb/mongodb";
import { createUser } from "./createUser";

/**
 * Creates a pending user (same schema as main user, verified: false)
 */
export async function createPendingUser(data) {
  const pendingUsers = await getPendingUsersCollection();

  // Use createUser to fill schema, but do not insert into main users table
  const userDoc = await createUser({ ...data, verified: false }, false);

  const { _id, ...insertData } = userDoc;
  const result = await pendingUsers.insertOne(insertData);

  return { ...insertData, _id: result.insertedId };
}
