import { headers } from "next/headers";
import Stripe from "stripe";
import clientPromise from "@/lib/mongodb/mongodb";
import { ObjectId } from "mongodb";
import { errorResponse } from "@/lib/responsehandlers/errorResponse";
import { successResponse } from "@/lib/responsehandlers/successResponse";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  console.log("🔥 WEBHOOK HIT");

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    return errorResponse("MISSING_ENV", "STRIPE_WEBHOOK_SECRET not set", 500);
  }
  if (!process.env.STRIPE_SECRET_KEY) {
    return errorResponse("MISSING_ENV", "STRIPE_SECRET_KEY not set", 500);
  }

  const body = await req.text();

  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return errorResponse(
      "NO_SIGNATURE",
      "Missing Stripe signature header",
      400,
    );
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    // console.error("Webhook signature error:", err.message);
    return errorResponse("WEBHOOK_INVALID_SIGNATURE", err.message, 400);
  }

  console.log("✅ Webhook event:", event.type, "eventId:", event.id);

  const client = await clientPromise;
  const db = client.db("doclitic");

  //✅ ADD: global idempotency for ALL webhook event types (not just invoice.payment_succeeded)
  async function markEventProcessed(evt, extra = {}) {
    const r = await db.collection("stripe_events").updateOne(
      { eventId: evt.id },
      {
        $setOnInsert: {
          eventId: evt.id,
          type: evt.type,
          processedAt: new Date(),
          ...extra,
        },
      },
      { upsert: true },
    );
    return r.upsertedCount === 1; // true = first time
  }
  // ✅ ADD: plan -> docs mapping in ONE place
  function docsForPlan(plan) {
    if (plan === "premium") return 350;
    if (plan === "pro") return 75;
    if (plan === "basic") return 15;
    return 3;
  }
  function getPeriodEndSeconds(sub) {
    return (
      sub?.current_period_end ??
      sub?.items?.data?.[0]?.current_period_end ??
      null
    );
  }

  function getPeriodStartSeconds(sub) {
    return (
      sub?.current_period_start ??
      sub?.items?.data?.[0]?.current_period_start ??
      null
    );
  }

  function toDateFromSeconds(sec) {
    return sec ? new Date(sec * 1000) : null;
  }

  // ------------------------
  // 1️⃣ Checkout session completed
  // ------------------------
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const firstTime = await markEventProcessed(event, {
      checkoutSessionId: session?.id ?? null,
    });
    if (!firstTime) {
      return successResponse({ received: true }, "Already processed", 200);
    }

    // One-time checkout has no subscription
    if (!session?.subscription) {
      return successResponse(
        { received: true },
        "No subscription (one-time)",
        200,
      );
    }

    // // Retrieve subscription to read metadata/price metadata
    // const subscription = await stripe.subscriptions.retrieve(
    //   session.subscription,
    // );

    // const subscriptionId = subscription.id; // new subscription id

    // const userId = subscription.metadata?.userId || null;

    // // const plan = subscription.metadata?.plan;
    // // ✅ CHANGE: prefer plan from Price metadata (most reliable)
    // const plan =
    //   subscription.items?.data?.[0]?.price?.metadata?.plan ??
    //   subscription.metadata?.plan ??
    //   null;

    //   const periodEndSec = getPeriodEndSeconds(subscription);
    //   const periodStartSec = getPeriodStartSeconds(subscription);

    const subscriptionId = session?.subscription ?? null;
    const userId =
      session?.metadata?.userId ?? session?.client_reference_id ?? null;

    const plan = session?.metadata?.plan ?? null;
    if (!subscriptionId || !userId || !plan) {
      console.error("❌ Missing metadata", { subscriptionId, userId, plan });
      // Webhook should still return 2xx to Stripe; log and exit
      return successResponse({ received: true }, "Missing metadata", 200);
    }
    await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          stripeSubscriptionId: subscriptionId,
          plan,
          stripeCustomerId: session?.customer ?? null,
          subscriptionStatus:
            session.payment_status === "paid" ? "active" : "pending",
          updatedAt: new Date(),
        },
      },
    );

    // await db.collection("users").updateOne(
    //   { _id: new ObjectId(userId) },
    //   {
    //     $set: {
    //       stripeSubscriptionId: subscriptionId,
    //       plan,
    //       subscriptionStatus:
    //         session.payment_status === "paid" ? "active" : "pending",

    //       cancelAtPeriodEnd: !!subscription.cancel_at_period_end,

    //       // ✅ NEXT BILLING DATE (what to show user)
    //       nextBillingDate: toDateFromSeconds(periodEndSec),

    //       // optional but useful
    //       currentPeriodStart: toDateFromSeconds(periodStartSec),
    //       currentPeriodEnd: toDateFromSeconds(periodEndSec),

    //       updatedAt: new Date(),
    //     },
    //   },
    // );

    console.log("➡️ Subscription saved to user:", userId, subscriptionId);
    return successResponse({ received: true }, "Checkout processed", 200);
  }

  // ------------------------
  // ✅ 1️⃣ invoice.payment_succeeded (stable version)
  // ------------------------
  if (event.type === "invoice.payment_succeeded") {
    const invoice = event.data.object;

    const firstTime = await markEventProcessed(event, {
      invoiceId: invoice?.id ?? null,
    });
    if (!firstTime)
      return successResponse({ received: true }, "Already processed", 200);

    const subscriptionId =
      invoice?.subscription ??
      invoice?.lines?.data
        ?.map((l) => l.parent?.subscription_item_details?.subscription)
        ?.find(Boolean) ??
      null;

    const customerId = invoice?.customer ?? null;

    if (!subscriptionId) {
      console.error("❌ Missing subscriptionId", invoice?.id);
      return successResponse({ received: true }, "Missing subscriptionId", 200);
    }

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    const plan =
      subscription.items?.data?.[0]?.price?.metadata?.plan ??
      subscription.metadata?.plan ??
      null;

    if (!plan) {
      console.error("❌ Missing plan", subscriptionId);
      return successResponse({ received: true }, "Missing plan", 200);
    }

    const periodEndSec =
      getPeriodEndSeconds(subscription) ??
      invoice?.lines?.data?.[0]?.period?.end ??
      null;

    const now = new Date();

    const update = {
      $set: {
        subscriptionStatus: "active",
        plan,
        cancelAtPeriodEnd: !!subscription.cancel_at_period_end,
        nextBillingDate: toDateFromSeconds(periodEndSec),
        currentPeriodEnd: toDateFromSeconds(periodEndSec),
        stripeSubscriptionId: subscriptionId, // ensure saved
        updatedAt: now,
      },
    };

    const docsToAdd = docsForPlan(plan);
    const billingReason = invoice?.billing_reason ?? null;

    const shouldGrantCredits =
      billingReason === "subscription_cycle" ||
      billingReason === "subscription_create";

    if (shouldGrantCredits) {
      update.$set.docsAmount = docsToAdd;
      update.$set.creditsGrantedAt = now;
    }

    const filter = {
      $or: [
        { stripeSubscriptionId: subscriptionId },
        ...(customerId ? [{ stripeCustomerId: customerId }] : []),
      ],
    };

    const resultUser = await db.collection("users").updateOne(filter, update);

    if (resultUser.matchedCount === 0) {
      console.error("❌ User not found for invoice", subscriptionId);
    }

    return successResponse(
      { received: true, docsAdded: docsToAdd, plan },
      "Invoice processed",
      200,
    );
  }
  // ------------------------
  //✅ 2️⃣ invoice.payment_failed (stable version)
  // ------------------------
  if (event.type === "invoice.payment_failed") {
    const invoice = event.data.object;

    const firstTime = await markEventProcessed(event, {
      invoiceId: invoice?.id ?? null,
    });
    if (!firstTime)
      return successResponse({ received: true }, "Already processed", 200);

    const subscriptionId = invoice?.subscription ?? null;
    const customerId = invoice?.customer ?? null;

    if (!subscriptionId) {
      return successResponse({ received: true }, "Missing subscriptionId", 200);
    }

    const filter = {
      $or: [
        { stripeSubscriptionId: subscriptionId },
        ...(customerId ? [{ stripeCustomerId: customerId }] : []),
      ],
    };

    await db.collection("users").updateOne(filter, {
      $set: {
        subscriptionStatus: "past_due",
        stripeSubscriptionId: subscriptionId,
        updatedAt: new Date(),
      },
    });

    return successResponse({ received: true }, "Payment failed handled", 200);
  }

  // ------------------------
  // 4) customer.subscription.updated / deleted
  //    ✅ includes IMMEDIATE CANCEL support (status="canceled")
  // ------------------------
  if (
    event.type === "customer.subscription.updated" ||
    event.type === "customer.subscription.deleted"
  ) {
    const subscription = event.data.object;

    // ✅ idempotency FIRST
    const firstTime = await markEventProcessed(event, {
      subscriptionId: subscription?.id ?? null,
    });
    if (!firstTime) {
      return successResponse({ received: true }, "Already processed", 200);
    }

    const subscriptionId = subscription?.id;
    if (!subscriptionId) {
      return successResponse({ received: true }, "Missing subscriptionId", 200);
    }

    const stripeStatus = subscription.status; // active | canceled | past_due | unpaid | ...
    const cancelAtPeriodEnd = !!subscription.cancel_at_period_end;

    const periodEndSec = getPeriodEndSeconds(subscription);
    const periodStartSec = getPeriodStartSeconds(subscription);

    const currentPeriodEnd = toDateFromSeconds(periodEndSec);
    const currentPeriodStart = toDateFromSeconds(periodStartSec);

    // const currentPeriodEnd = subscription.current_period_end
    //   ? new Date(subscription.current_period_end * 1000)
    //   : null;

    const canceledAt = subscription.canceled_at
      ? new Date(subscription.canceled_at * 1000)
      : null;

    // ✅ CHANGE: consistent plan from Price metadata
    const detectedPlan =
      subscription.items?.data?.[0]?.price?.metadata?.plan ??
      subscription.metadata?.plan ??
      null;

    // ✅ ADD: app-level status/plan mapping
    let appStatus = stripeStatus;
    let appPlan = detectedPlan;

    // Scheduled cancel at period end
    if (cancelAtPeriodEnd && stripeStatus === "active") {
      appStatus = "canceling"; // your UI can show "Cancels on ..."
      // keep plan until period end
    }
    const isDeleted = event.type === "customer.subscription.deleted";
    const isCanceled = stripeStatus === "canceled" || isDeleted;

    if (isCanceled) {
      appStatus = "canceled";
      appPlan = "free";
    }

    // ✅ IMPORTANT: only set billing dates if we actually have them
    const setPatch = {
      subscriptionStatus: appStatus,
      plan: appPlan,
      cancelAtPeriodEnd,
      canceledAt,
      updatedAt: new Date(),
    };

    if (currentPeriodStart) {
      setPatch.currentPeriodStart = currentPeriodStart;
    }

    if (!isCanceled) {
      // active/canceling: keep "next billing"/"access ends" date
      if (currentPeriodEnd) {
        setPatch.nextBillingDate = currentPeriodEnd;
        setPatch.currentPeriodEnd = currentPeriodEnd;
        // optional: better UI naming
        if (cancelAtPeriodEnd) setPatch.accessEndsAt = currentPeriodEnd;
      }
      if (!cancelAtPeriodEnd) setPatch.accessEndsAt = null; // ✅ add this
    } else {
      // ended: no future billing
      setPatch.nextBillingDate = null;
      setPatch.accessEndsAt = null;
      setPatch.cancelAtPeriodEnd = false;

      // ✅ your requirement: downgrade docs at period end
      setPatch.docsAmount = 3;
    }

    await db
      .collection("users")
      .updateOne({ stripeSubscriptionId: subscriptionId }, { $set: setPatch });

    return successResponse(
      {
        received: true,
        subscriptionId,
        stripeStatus,
        appStatus,
        appPlan,
        cancelAtPeriodEnd,
        currentPeriodEnd,
        isCanceled,
      },
      "Subscription processed",
      200,
    );
  }

  // ------------------------
  // ✅ 3️⃣ invoice.finalization_failed (stable version)
  // ------------------------
  if (event.type === "invoice.finalization_failed") {
    const invoice = event.data.object;

    const firstTime = await markEventProcessed(event, {
      invoiceId: invoice?.id ?? null,
    });
    if (!firstTime)
      return successResponse({ received: true }, "Already processed", 200);

    const subscriptionId = invoice?.subscription ?? null;
    const customerId = invoice?.customer ?? null;

    const errorMsg =
      invoice?.last_finalization_error?.message ??
      invoice?.last_payment_error?.message ??
      "Invoice finalization failed";

    const filter = {
      $or: [
        ...(subscriptionId ? [{ stripeSubscriptionId: subscriptionId }] : []),
        ...(customerId ? [{ stripeCustomerId: customerId }] : []),
      ],
    };

    await db.collection("users").updateOne(filter, {
      $set: {
        subscriptionStatus: "incomplete",
        stripeSubscriptionId: subscriptionId ?? undefined,
        lastInvoiceId: invoice?.id ?? null,
        lastInvoiceStatus: invoice?.status ?? null,
        lastInvoiceError: errorMsg,
        updatedAt: new Date(),
      },
    });

    return successResponse(
      { received: true },
      "Invoice finalization failed handled",
      200,
    );
  }

  // Any other events: acknowledge
  return successResponse({ received: true }, "Event ignored", 200);
}
