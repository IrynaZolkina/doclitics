"use client";
import CheckoutForm from "@/components/CheckoutForm";
import React from "react";
// import Link from "next/link";
// import FlexibleButton from "../components/FlexibleButton";

export default function CheckoutPage() {
  const email = "customer@example.com";
  const amount = 100; // $10.00

  return (
    <div style={{ padding: 24 }}>
      <h2>Checkout</h2>

      {/* FlexibleButton linking to CheckoutForm */}
      {/* <Link href="/checkout">
        <FlexibleButton variant="tertiary" border padding="12px 70px">
          Get Started
        </FlexibleButton>
      </Link> */}

      {/* PaymentElement form */}
      <CheckoutForm amount={amount} email={email} />
    </div>
  );
}
