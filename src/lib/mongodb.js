import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URL; // your MongoDB connection string
const options = {};

// Create a global variable to hold the client across hot reloads in dev
let client;
let clientPromise;

if (!uri) {
  throw new Error("Please define the MONGODB_URL environment variable");
}

// if (process.env.NODE_ENV === "development") {
//   // In development, use a global variable so it persists across module reloads
//   if (!global._mongoClientPromise) {
//     client = new MongoClient(uri, options);
//     global._mongoClientPromise = client.connect();
//   }
//   clientPromise = global._mongoClientPromise;
// } else {
// In production, create a new client for each invocation
client = new MongoClient(uri, options);
clientPromise = client.connect();
// }

export default clientPromise;

export async function getUserCollection() {
  const client = await clientPromise;
  return client.db("doclitic").collection("users");
}

export async function getVerificationCollection() {
  const client = await clientPromise;
  return client.db("doclitic").collection("verifications");
}

export async function getRefreshTokensCollection() {
  const client = await clientPromise;
  return client.db("doclitic").collection("refreshtokens");
}
export async function getPendingUsersCollection() {
  const client = await clientPromise;
  return client.db("doclitic").collection("pendingusers");
}
