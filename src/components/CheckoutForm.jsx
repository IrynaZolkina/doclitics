"use client";
import React, { useEffect, useState } from "react";
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

function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [status, setStatus] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setStatus("processing");
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.origin + "/payment-result" },
      redirect: "if_required",
    });

    if (error) {
      setErrorMessage(error.message);
      setStatus("error");
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      setStatus("succeeded");
    } else {
      setStatus(paymentIntent?.status || "succeeded");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ maxWidth: 400, margin: "20px auto" }}
    >
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || status === "processing"}
        style={{
          marginTop: 20,
          padding: "12px 24px",
          background: "#6772e5",
          color: "#fff",
          border: "none",
          borderRadius: 4,
          cursor: "pointer",
        }}
      >
        {status === "processing" ? "Processing…" : "Pay"}
      </button>

      {status === "error" && <p style={{ color: "red" }}>{errorMessage}</p>}
      {status === "succeeded" && (
        <p style={{ color: "green" }}>Payment succeeded!</p>
      )}
    </form>
  );
}

export default function CheckoutForm({ amount, email }) {
  const [clientSecret, setClientSecret] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function createPayment() {
      try {
        const res = await fetch("/api/payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount, email }),
        });
        const data = await res.json();
        if (data.clientSecret) setClientSecret(data.clientSecret);
        else console.error(data.error);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    createPayment();
  }, [amount, email]);

  if (loading) return <p>Loading payment…</p>;
  if (!clientSecret) return <p>Error loading payment.</p>;

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <PaymentForm />
    </Elements>
  );
}
