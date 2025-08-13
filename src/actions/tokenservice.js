import { getCollection } from "@/lib/db";
import jwt from "jsonwebtoken";

export async function generateToken(payload) {
  const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "30m",
  });
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "30d",
  });

  return { accessToken, refreshToken };
}

export async function saveTokenToDB(userId, refreshToken) {
  const tokensCollection = await getCollection("tokens");
  //   console.log("tokensCollection---", tokensCollection);
  console.log("tokens-userId, refreshToken--", userId, refreshToken);
  const tokenData = await tokensCollection.findOne({ userId: userId });

  if (tokenData) {
    tokenData.refreshToken = refreshToken;
    tokenData.save();
    return;
  }
  const token = await tokensCollection.insertOne({
    userId: userId,
    refreshToken: refreshToken,
  });

  return token;
}
