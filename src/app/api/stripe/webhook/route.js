import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import clientPromise from "@/lib/mongodb/mongodb";
import { ObjectId } from "mongodb";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.error("❌ Webhook signature error:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  console.log("✅ Webhook event:", event.type);

  // 🔥 THIS is the correct event for subscriptions
  if (event.type === "customer.subscription.created") {
    const subscription = event.data.object;

    const userId = subscription.metadata?.userId;
    const plan = subscription.metadata?.plan;

    if (!userId || !plan) {
      console.error("❌ Missing subscription metadata");
      return NextResponse.json({ received: true });
    }
    console.log("➡️ Subscription metadata:", { userId, plan });
    console.log("➡️ Subscription id:", subscription.id);
    console.log("➡️ Subscription customer:", subscription.customer);
    const client = await clientPromise;
    const db = client.db("doclitic");

    const idtest = new ObjectId(userId);
    console.log("➡️ User _id:", idtest);
    const userfound = await db.collection("users").findOne({ _id: idtest });
    console.log("➡️ User found:", userfound);
    // const docAmount = plan === "Basic" ? 50 : plan === "Pro" ? 200 : 1000;
    const docAmount = userfound.docsAmount + 1000;
    const result = await db.collection("users").updateOne(
      { _id: idtest },
      {
        $set: {
          stripeSubscriptionId: subscription.id,
          stripeCustomerId: subscription.customer,
          plan,
          docsAmount: docAmount,
          subscriptionStatus: subscription.status, // active
          updatedAt: new Date(),
        },
      },
    );

    console.log("✅ User updated from webhook", result);
  }

  return NextResponse.json({ received: true });
}

// import { headers } from "next/headers";
// import { NextResponse } from "next/server";
// import Stripe from "stripe";
// import clientPromise from "@/lib/mongodb/mongodb";
// import { ObjectId } from "mongodb";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// export async function POST(req) {
//   console.log("Webhook hit!");

//   // ✅ MUST await headers()
//   const headersList = await headers();
//   const signature = headersList.get("stripe-signature");

//   // ✅ MUST read raw body
//   const body = await req.text();

//   let event;

//   try {
//     event = stripe.webhooks.constructEvent(
//       body,
//       signature,
//       process.env.STRIPE_WEBHOOK_SECRET,
//     );
//   } catch (err) {
//     console.error("❌ Stripe signature verification failed:", err.message);
//     return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
//   }

//   console.log("✅ Webhook event:", event.type);

//   if (
//     //event.type === "checkout.session.completed"
//     event.type === "customer.subscription.created" ||
//     event.type === "customer.subscription.updated"
//   ) {
//     // const session = event.data.object;
//     const subscription = event.data.object;
//     const userId = subscription.metadata?.userId;
//     const plan = subscription.metadata?.plan;
//     // const userId = session.metadata?.userId;
//     // const plan = session.metadata?.plan;

//     console.log("➡️ Subscription metadata:", { userId, plan });

//     if (!userId || !plan) {
//       console.error("❌ Missing metadata");
//       return NextResponse.json({ received: true });
//     }

//     const client = await clientPromise;
//     const db = client.db();

//     const result = await db.collection("users").updateOne(
//       { _id: new ObjectId(userId) },
//       {
//         $set: {
//           stripeCustomerId: subscription.customer,
//           stripeSubscriptionId: subscription.subscription,
//           plan,
//           subscriptionStatus: "active",
//           updatedAt: new Date(),
//         },
//       },
//     );
//     console.log("✅ Mongo update result:", result);
//   }

//   return NextResponse.json({ received: true });
// }
