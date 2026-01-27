"use client";
import React from "react";

export default function TestButton() {
  const style = {
    background: "#3c83f6",
    color: "white",
    fontSize: "24px",
    fontWeight: "800",
    fontFamily: "Manrope, sans-serif",
    padding: "14px 28px",
    borderRadius: "10px",
    border: "none",
  };

  return <button style={style}>Test Font</button>;
}
