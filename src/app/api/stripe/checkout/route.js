import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/stripe";
import { PLANS } from "@/lib/stripe/plans";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import clientPromise from "@/lib/mongodb/mongodb";

export async function POST(req) {
  try {
    const { plan } = await req.json();
    const planKey = plan.trim().toLowerCase();
    const selectedPlan = PLANS[planKey];
    console.log("Selecting plan - checkout route:", selectedPlan, plan);
    if (!selectedPlan || !selectedPlan.stripePriceId) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 🔑 1. Ensure Stripe customer exists
    let customerId = user.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          userId: user._id.toString(),
        },
      });

      customerId = customer.id;

      // save customer id immediately
      const client = await clientPromise;
      await client
        .db()
        .collection("users")
        .updateOne(
          { _id: user._id },
          {
            $set: {
              stripeCustomerId: customerId,
              updatedAt: new Date(),
            },
          },
        );
    }

    // 🔑 2. Create checkout session
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",

      customer: customerId, // ✅ REQUIRED
      payment_method_types: ["card"],
      line_items: [
        {
          price: selectedPlan.stripePriceId,
          quantity: 1,
        },
      ],

      subscription_data: {
        metadata: {
          userId: user._id.toString(),
          plan: planKey,
        },
      },

      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("❌ Stripe checkout error:", err);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}

// import { NextResponse } from "next/server";
// import { stripe } from "@/lib/stripe/stripe";
// import { PLANS } from "@/lib/stripe/plans";
// import { getCurrentUser } from "@/lib/auth/getCurrentUser";

// export async function POST(req) {
//   try {
//     const { plan } = await req.json();
//     const planKey = plan.trim().toLowerCase();
//     const selectedPlan = PLANS[planKey];
//     const user = await getCurrentUser();
//     console.log("Selecting plan - checkout route:", plan, user);

//     if (!user) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     // const selectedPlan = PLANS[plan];

//     if (!selectedPlan || !selectedPlan.stripePriceId) {
//       return NextResponse.json(
//         { error: "Invalid or free plan" },
//         { status: 400 },
//       );
//     }

//     // Prevent double subscription
//     if (user.stripeSubscriptionId) {
//       return NextResponse.json(
//         { error: "Already subscribed" },
//         { status: 400 },
//       );
//     }

//     const session = await stripe.checkout.sessions.create({
//       mode: "subscription",
//       customer_creation: "always", // 🔥 REQUIRED
//       payment_method_types: ["card"],
//       customer_email: user.email,

//       line_items: [
//         {
//           price: selectedPlan.stripePriceId,
//           quantity: 1,
//         },
//       ],

//       // ✅ ADD THIS (CRITICAL)
//       subscription_data: {
//         metadata: {
//           userId: user._id.toString(),
//           plan: planKey,
//         },
//       },
//       // (keep this too, optional but fine)
//       metadata: {
//         userId: user._id.toString(),
//         plan: planKey,
//       },

//       success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
//       cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cancel`,
//     });

//     return NextResponse.json({ url: session.url });
//   } catch (err) {
//     console.error("❌ Stripe checkout error FULL:", err);
//     console.error("❌ Stripe message:", err?.message);
//     console.error("❌ Stripe raw:", err?.raw);

//     return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
//   }
// }
