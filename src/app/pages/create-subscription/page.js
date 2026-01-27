"use client";
import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

export default function CreateSubscriptionPage() {
  const [clientSecret, setClientSecret] = useState(null);

  useEffect(() => {
    fetch("/api/subscription/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "test@example.com" }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, []);

  if (!clientSecret) return <div>Loading Stripe...</div>; // ✅ Only render Elements when clientSecret exists

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "50px auto",
        padding: "20px",
        border: "1px solid #ccc",
      }}
    >
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <SubscriptionForm />
      </Elements>
    </div>
  );
}

function SubscriptionForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const submitPayment = async () => {
    if (!stripe || !elements) return;
    setLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "http://localhost:3000/subscription-success",
      },
    });

    if (error) alert(error.message);
    setLoading(false);
  };

  return (
    <div>
      <PaymentElement />
      <button onClick={submitPayment} disabled={!stripe || loading}>
        Confirm Subscription
      </button>
    </div>
  );
}
