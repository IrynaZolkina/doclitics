"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React from "react";

// Load Stripe with your PUBLIC key
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

export default function StripeProvider({ children }) {
  return (
    <Elements
      stripe={stripePromise}
      //   options={{
      //     mode: "payment",
      //     currency: "usd", // you will override later if needed
      //     amount: 0, // will be dynamic later
      //   }}
    >
      {children}
    </Elements>
  );
}
