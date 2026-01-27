// import { MongoClient } from "mongodb";
import { MongoClient, ServerApiVersion } from "mongodb";

export async function connectToDatabase() {
  //   const client = await MongoClient.connect(process.env.MONGODB_URL);
  const client = new MongoClient(process.env.MONGODB_URL, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
  async function run() {
    try {
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect();
      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log(
        "Pinged your deployment. You successfully connected to MongoDB!"
      );
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
  }
  // run().catch(console.dir);
  //   return client;
}
