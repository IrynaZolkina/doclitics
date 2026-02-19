import { stripe } from "@/lib/stripe/stripe";
import { PLANS } from "@/lib/stripe/plans";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import clientPromise, { getUserCollection } from "@/lib/mongodb/mongodb";
import { ObjectId } from "mongodb";

import { errorResponse } from "@/lib/responsehandlers/errorResponse";
import { successResponse } from "@/lib/responsehandlers/successResponse";

import { getCsrfTokens, validateCsrf } from "@/lib/auth/csrf";
import { cookies } from "next/headers";
import { getUserFromToken } from "@/lib/auth/getUserFromToken";
import { verifyAccessToken } from "@/lib/jwt";

export async function POST(req) {
  try {
    // ✅ CSRF check (important for cookie-auth POST)
    try {
      const { csrfHeader, csrfCookie } = getCsrfTokens(request);
      validateCsrf(csrfHeader, csrfCookie);
    } catch (err) {
      console.log("CHAT ERROR ----:------------------ 1 ");
      return errorResponse(
        "CSRF_MISMATCH",
        err.message || "CSRF mismatch",
        403,
      );
    }

    // 0) Read plan from request
    const { plan } = await req.json(); // "Free", "Pro", "Enterprise"
    const planKey = String(plan || "")
      .trim()
      .toLowerCase();

    // Allowlist plan keys (avoid weird keys like "__proto__")
    if (!Object.prototype.hasOwnProperty.call(PLANS, planKey)) {
      return errorResponse("INVALID_PLAN", "Invalid plan", 400);
    }

    const selectedPlan = PLANS[planKey];
    console.log(
      "Selecting plan - checkout route:",
      selectedPlan,
      plan,
      "planKey---",
      planKey,
    );
    if (!selectedPlan || !selectedPlan.stripePriceId) {
      return errorResponse("INVALID_PLAN", "Invalid plan", 400);
    }

    // 1) Auth user (server reads cookies)
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    if (!accessToken) return errorResponse("UNAUTHORIZED", "Unauthorized", 401);

    const payload = verifyAccessToken(accessToken);

    if (!payload) return errorResponse("UNAUTHORIZED", "Unauthorized", 401);

    const userId = ObjectId.createFromHexString(payload.userId);
    const users = await getUserCollection();
    const user = await users.findOne({ _id: userId });

    //  const { user } = await getUserFromToken(accessToken);

    // const user = await getCurrentUser();
    if (!user) {
      return errorResponse("UNAUTHORIZED", "Unauthorized", 401);
    }

    // const userId =
    //   typeof user._id === "string" ? new ObjectId(user._id) : user._id;

    // Optional: prevent duplicate subscriptions
    if (user.stripeSubscriptionId && user.subscriptionStatus === "active") {
      return errorResponse(
        "ALREADY_SUBSCRIBED",
        "You already have an active subscription",
        400,
      );
    }

    // 1️⃣ Ensure Stripe customer exists
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { userId: userId.toString() },
      });
      customerId = customer.id;

      const client = await clientPromise;
      await client
        .db("doclitic")
        .collection("users")
        .updateOne(
          { _id: userId },
          { $set: { stripeCustomerId: customerId, updatedAt: new Date() } },
        );
    }

    // 2️⃣ Create checkout session in subscription mode
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [{ price: selectedPlan.stripePriceId, quantity: 1 }],
      subscription_data: {
        metadata: {
          userId: userId.toString(),
          plan: planKey,
        },
      },
      client_reference_id: userId.toString(),
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/stripe/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/stripe/cancel`,
    });

    return successResponse(
      { url: session.url },
      "Checkout session created",
      200,
    );
  } catch (err) {
    console.error("CHECKOUT ROUTE ERROR:", err); // ✅ add this
    return errorResponse(
      err.code || "CHECKOUT_FAILED",
      err.message || "Checkout failed",
      err.status || 500,
    );
  }
}

// import { NextResponse } from "next/server";
// import { stripe } from "@/lib/stripe/stripe";
// import { PLANS } from "@/lib/stripe/plans";
// import { getCurrentUser } from "@/lib/auth/getCurrentUser";
// import clientPromise from "@/lib/mongodb/mongodb";

// export async function POST(req) {
//   try {
//     const { plan } = await req.json();
//     const planKey = plan.trim().toLowerCase();
//     const selectedPlan = PLANS[planKey];
//     console.log("Selecting plan - checkout route:", selectedPlan, plan);
//     if (!selectedPlan || !selectedPlan.stripePriceId) {
//       return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
//     }

//     const user = await getCurrentUser();
//     if (!user) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     // 🔑 1. Ensure Stripe customer exists
//     let customerId = user.stripeCustomerId;

//     if (!customerId) {
//       const customer = await stripe.customers.create({
//         email: user.email,
//         metadata: {
//           userId: user._id.toString(),
//         },
//       });

//       customerId = customer.id;

//       // save customer id immediately
//       const client = await clientPromise;
//       await client
//         .db()
//         .collection("users")
//         .updateOne(
//           { _id: user._id },
//           {
//             $set: {
//               stripeCustomerId: customerId,
//               updatedAt: new Date(),
//             },
//           },
//         );
//     }

//     // 🔑 2. Create checkout session
//     const session = await stripe.checkout.sessions.create({
//       mode: "subscription",

//       customer: customerId, // ✅ REQUIRED
//       payment_method_types: ["card"],
//       line_items: [
//         {
//           price: selectedPlan.stripePriceId,
//           quantity: 1,
//         },
//       ],

//       subscription_data: {
//         metadata: {
//           userId: user._id.toString(),
//           plan: planKey,
//         },
//       },

//       success_url: `${process.env.NEXT_PUBLIC_APP_URL}/stripe/success`,
//       cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/stripe/cancel`,
//     });

//     return NextResponse.json({ url: session.url });
//   } catch (err) {
//     console.error("❌ Stripe checkout error:", err);
//     return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
//   }
// }

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
