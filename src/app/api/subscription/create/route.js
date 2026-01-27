import { stripe } from "@/lib/stripe/stripe";

export async function POST(request) {
  try {
    const { email } = await request.json();

    const customer = await stripe.customers.create({ email });

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: "price_1SVsa9QN3xgsemC70rvnOWiC" }],
      payment_behavior: "default_incomplete",
      expand: ["latest_invoice.payment_intent"],
    });
    // console.log(
    //   "clientSecret:",
    //   subscription.latest_invoice.payment_intent.client_secret
    // );
    // Check that clientSecret exists
    if (!subscription.latest_invoice.payment_intent?.client_secret) {
      throw new Error("No client secret returned");
    }

    return Response.json({
      subscriptionId: subscription.id,
      clientSecret: subscription.latest_invoice.payment_intent.client_secret,
    });
  } catch (err) {
    console.error(err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
