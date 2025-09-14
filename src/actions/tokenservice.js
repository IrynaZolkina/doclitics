import { getCollection } from "@/lib/db";
import jwt from "jsonwebtoken";

export async function generateTokens(payload) {
  const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "30m",
  });
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "30d",
  });

  return { accessToken, refreshToken };
}

// export async function saveTokenToDB(userId, refreshToken) {
//   const tokensCollection = await getCollection("tokens");

//   console.log("tokens-userId, refreshToken--", userId, refreshToken);
//   const tokenData = await tokensCollection.findOne({ user: userId });

//   if (tokenData) {
//     tokenData.refreshToken = refreshToken;
//     tokenData.save();
//     return;
//   }
//   const token = await tokensCollection.insertOne({
//     user: userId,
//     refreshToken: refreshToken,
//   });

//   return token;
// }
export async function saveTokenToDB(userId, refreshToken) {
  const tokensCollection = await getCollection("refreshTokens");
  // const tokensCollection = await getCollection("tokens");
  console.log("tokens-userId, refreshToken--", userId, refreshToken);

  // Check if token already exists
  const tokenData = await tokensCollection.findOne({ user: userId });

  if (tokenData) {
    // Update the existing token
    await tokensCollection.updateOne(
      { _id: tokenData._id }, // filter by document id
      { $set: { refreshToken } } // update refreshToken field
    );
    return tokenData._id; // return the id (or whatever you prefer)
  }

  // Insert new token
  const result = await tokensCollection.insertOne({
    user: userId,
    refreshToken,
  });

  return result.insertedId; // return the inserted document's id
}
