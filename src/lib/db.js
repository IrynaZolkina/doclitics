import { MongoClient, ServerApiVersion } from "mongodb";

import fs from "fs";
import { Binary } from "mongodb";

//   const client = await MongoClient.connect(process.env.MONGODB_URL);
const client = new MongoClient(process.env.MONGODB_URL, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function getDB(dbName) {
  try {
    await client.connect();
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
    return client.db(dbName);
  } catch (error) {
    console.log("Error connecting to MongoDB:", error);
  }
  //   finally {
  //     // Ensures that the client will close when you finish/error
  //     await client.close();
  //   }
}

export async function getCollection(collectionName) {
  const db = await getDB("auth");
  // console.log("DB connected-------", db);
  if (db) {
    return db.collection(collectionName);
  }
  return null;
}

export async function savePdfToDb(file) {
  const collection = getCollection("files");

  const pdfBuffer = fs.readFileSync(file);
  console.log("---pdfBuffer---", pdfBuffer, "------*****");
}
