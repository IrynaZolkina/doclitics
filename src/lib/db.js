import { MongoClient, ServerApiVersion } from "mongodb";

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    //await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
    return client.db(dbName);
  } catch (error) {
    console.log("Error");
  }
  //   finally {
  //     // Ensures that the client will close when you finish/error
  //     await client.close();
  //   }
}

export async function getCollection(collectionName) {
  const db = await getDB("auth");
  if (db) {
    return db.collection(collectionName);
  }
  return null;
}
