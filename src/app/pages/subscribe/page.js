"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

function CheckoutForm({ customerId, priceId }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    const res = await fetch("/api/create-subscription", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerId,
        priceId,
        paymentMethodId: paymentMethod.id,
      }),
    });

    const data = await res.json();

    if (data.error) {
      alert(data.error);
      setLoading(false);
      return;
    }

    if (data.clientSecret) {
      const { error: confirmError } = await stripe.confirmCardPayment(
        data.clientSecret
      );
      if (confirmError) {
        alert(confirmError.message);
        setLoading(false);
        return;
      }
    }

    alert("Subscription successful!");
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={loading}>
        {loading ? "Processing..." : "Subscribe"}
      </button>
    </form>
  );
}

export default function SubscribePage() {
  const customerId = "cus_123"; // Replace with real customer ID from your DB
  const priceId = "price_123"; // Replace with your Stripe Price ID

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm customerId={customerId} priceId={priceId} />
    </Elements>
  );
}
