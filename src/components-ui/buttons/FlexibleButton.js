"use client";
import React from "react";
import styles from "./FlexibleButton.module.css";

export default function FlexibleButton({
  onClick,
  children,
  icon = null,
  variant = "primary", // primary, secondary, tertiary, quaternary, quinary
  disabled = false,
  fontSize = "18px",
  fontWeight = "500",
  fontFamily = "inherit",
  borderRadius = "14px",
  gap = "10px",
  padding = "14px 28px",
  border = "none",
  type = "button",
}) {
  return (
    <button
      type={type}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`${styles.button} ${styles[variant] ?? ""}`}
      style={{
        fontSize,
        fontWeight,
        fontFamily,
        borderRadius,
        gap,
        padding,
        border,
      }}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      {children}
    </button>
  );
}

/*********************** USAGE Normal */
{
  /* <FlexibleButton onClick={() => console.log("clicked!")}>
  Generate Summary!
</FlexibleButton> */
}
/*********************** USAGE With icon + dynamic padding */
{
  /* <FlexibleButton
  onClick={sendFile}
  icon={<FourStar />}
  padding="14px 36px"
  fontSize="20px"
  fontWeight="600"
>
  Generate Summary!
</FlexibleButton> */
}
/*********************** USAGE Disabled */
{
  /* <FlexibleButton disabled>Loading...</FlexibleButton> */
}
/*********************** USAGE Link mode */
{
  /* <FlexibleButton href="/pages/history">View History</FlexibleButton> */
}
{
  /* <FlexibleButton variant="primary">Primary</FlexibleButton>
<FlexibleButton variant="secondary">Secondary</FlexibleButton>
<FlexibleButton variant="tertiary">Tertiary</FlexibleButton>
<FlexibleButton variant="quaternary">Quaternary</FlexibleButton> // used in profile page
<FlexibleButton variant="quinary">Quinary</FlexibleButton>
<FlexibleButton variant="primary" disabled>Disabled</FlexibleButton> */
}
