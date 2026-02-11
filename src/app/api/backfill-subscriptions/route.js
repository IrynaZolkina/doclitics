// runs from terminal: curl -X GET "http://localhost:3000/api/backfill-subscriptions"x

import Stripe from "stripe";
import clientPromise from "@/lib/mongodb/mongodb";
import { ObjectId } from "mongodb";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function GET() {
  const subscriptions = await stripe.subscriptions.list({ limit: 100 });
  const client = await clientPromise;
  const db = client.db("doclitic");

  let count = 0;
  for (const sub of subscriptions.data) {
    const userId = sub.metadata.userId;
    if (!userId) continue;

    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          stripeSubscriptionId: sub.id,
          plan: sub.metadata.plan,
          subscriptionStatus: sub.status,
        },
      },
    );
    if (result.modifiedCount > 0) count++;
  }

  return new Response(`✅ Backfilled ${count} users`);
}
