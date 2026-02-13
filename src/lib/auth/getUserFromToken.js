// lib/auth.js
import { verifyAccessToken, verifyRefreshToken } from "@/lib/jwt";
import {
  getSummariesCollection,
  getUserCollection,
} from "@/lib/mongodb/mongodb";
import { ObjectId } from "mongodb";

export async function getUserFromToken(token) {
  //const payload = verifyRefreshToken(token);
  // console.log("--------------getUserFromToken payload:", payload);
  console.log("--------------getUserFromToken--- 1");
  const payload = verifyAccessToken(token);
  console.log("--------------getUserFromToken--- 2");
  if (!payload) return null;
  const userId = ObjectId.createFromHexString(payload.userId);
  console.log("--------------getUserFromToken--- 3");
  const users = await getUserCollection();
  const summaries = await getSummariesCollection();
  const userSummaries = await summaries
    .find(
      { userId: userId },
      {
        projection: {
          _id: 0,
          fileName: 1,
          summary_text_length: 1,
          createdAt: 1,
        },
      },
    )
    .sort({ createdAt: -1 }) // optional: newest first
    .toArray();
  // const user = await users.findOne({ email: payload.email });
  const user = await users.findOne({ _id: userId });
  console.log("userSummaries---------", userSummaries);
  return { user, userSummaries, payload };
}
