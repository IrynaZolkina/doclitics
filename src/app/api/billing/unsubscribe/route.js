// app/api/billing/unsubscribe/route.js
import { stripe } from "@/lib/stripe/stripe";
import clientPromise, { getUserCollection } from "@/lib/mongodb/mongodb";
import { ObjectId } from "mongodb";

import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { getCsrfTokens, validateCsrf } from "@/lib/auth/csrf";

import { errorResponse } from "@/lib/responsehandlers/errorResponse";
import { successResponse } from "@/lib/responsehandlers/successResponse";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/jwt";

function getPeriodEndSeconds(sub) {
  return (
    sub?.current_period_end ?? sub?.items?.data?.[0]?.current_period_end ?? null
  );
}
function toDateFromSeconds(sec) {
  return sec ? new Date(sec * 1000) : null;
}

export async function POST(request) {
  console.log("--------------Unsubscribe--- 1");
  try {
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
    console.log("--------------Unsubscribe--- 2");
    // const user = await getCurrentUser();

    // 1) Auth user (server reads cookies)
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    if (!accessToken) return errorResponse("UNAUTHORIZED", "Unauthorized", 401);

    const payload = verifyAccessToken(accessToken);

    if (!payload) return errorResponse("UNAUTHORIZED", "Unauthorized", 401);

    const userId = ObjectId.createFromHexString(payload.userId);
    const users = await getUserCollection();
    const user = await users.findOne({ _id: userId });

    console.log("--------------Unsubscribe--- 3", user);
    if (!user) return errorResponse("UNAUTHORIZED", "Unauthorized", 401);
    console.log("--------------Unsubscribe--- 3-1");
    // const userId =
    //   typeof user._id === "string" ? new ObjectId(user._id) : user._id;
    console.log("--------------Unsubscribe--- 3-2");
    const subscriptionId = user.stripeSubscriptionId;

    console.log("--------------Unsubscribe--- 3-3");
    if (!subscriptionId) {
      return errorResponse("NO_SUBSCRIPTION", "No subscription to cancel", 400);
    }

    console.log("--------------Unsubscribe--- 3-4");
    // schedule cancel at period end
    const updated = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });
    console.log("--------------Unsubscribe--- 3-5");
    const periodEndDate = toDateFromSeconds(getPeriodEndSeconds(updated));
    console.log("--------------Unsubscribe--- 3-6");
    const client = await clientPromise;
    const db = client.db("doclitic");

    // ✅ mark canceling + store end date for UI; DO NOT touch docsAmount
    console.log("--------------Unsubscribe--- 4");
    await db.collection("users").updateOne(
      { _id: userId },
      {
        $set: {
          subscriptionStatus: "canceling",
          cancelAtPeriodEnd: true,
          accessEndsAt: periodEndDate, // UI field (recommended)
          nextBillingDate: periodEndDate, // you can keep this if you want, but UI should label it as "Access ends"
          currentPeriodEnd: periodEndDate,
          updatedAt: new Date(),
        },
      },
    );
    console.log("--------------Unsubscribe--- 6");

    return successResponse(
      {
        ok: true,
        subscriptionId: updated.id,
        cancelAtPeriodEnd: true,
        accessEndsAt: periodEndDate ? periodEndDate.toISOString() : null,
      },
      "Cancel scheduled",
      200,
    );
  } catch (err) {
    console.error("UNSUBSCRIBE ROUTE ERROR:", err);
    console.log("--------------Unsubscribe--- 6 --- error");
    return errorResponse(
      err.code || "UNSUBSCRIBE_FAILED",
      err.message || "Unsubscribe failed",
      err.status || 500,
    );
  }
}
