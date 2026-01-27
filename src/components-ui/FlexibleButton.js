"use client";
import React from "react";

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
}) {
  return (
    <>
      <button
        type="button"
        onClick={disabled ? undefined : onClick}
        disabled={disabled}
        className={`flexible-button ${variant}`}
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
        {icon && (
          <span
            style={{ display: "flex", alignItems: "center", marginRight: gap }}
          >
            {icon}
          </span>
        )}
        {children}
      </button>

      <style jsx global>{`
        .flexible-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          line-height: 1.2;
          white-space: nowrap;
          cursor: pointer;
          user-select: none;
          transform: scale(1);
          transition: transform 0.12s ease, box-shadow 0.12s ease,
            filter 0.12s ease;
        }

        .flexible-button:not(:disabled):hover {
          transform: scale(1);
        }
        .flexible-button:not(:disabled):active {
          transform: scale(0.96);
          filter: brightness(0.95);
        }
        .flexible-button:focus-visible {
          outline: none;
          box-shadow: 0 0 0 3px rgba(100, 100, 255, 0.4);
        }
        .flexible-button {
          -webkit-tap-highlight-color: transparent;
        }
        .flexible-button span svg path {
          stroke: currentColor;
        }

        /* PRIMARY */
        .primary {
          background: var(--btn-primary-bg);
          color: var(--btn-primary-color);
          border: 1px solid var(--btn-primary-border, transparent);
        }
        .primary:hover {
          background: var(--btn-primary-hover);
        }

        /* SECONDARY */
        .secondary {
          background: var(--btn-secondary-bg);
          color: var(--btn-secondary-color);
          border: 1px solid var(--btn-secondary-border, transparent);
        }
        .secondary:hover {
          background: var(--btn-secondary-hover);
        }

        /* TERTIARY */
        .tertiary {
          background: var(--btn-tertiary-bg);
          color: var(--btn-tertiary-color);
          border: 1px solid var(--btn-tertiary-border, transparent);
        }
        .tertiary:hover {
          background: var(--btn-tertiary-hover);
        }

        /* QUATERNARY */
        .quaternary {
          background: var(--btn-quaternary-bg);
          color: var(--btn-quaternary-color);
          border: 1px solid var(--btn-quaternary-border, transparent);
        }
        .quaternary:hover {
          background: var(--btn-quaternary-hover);
        }

        /* QUINARY */
        .quinary {
          background: var(--btn-quinary-bg);
          color: var(--btn-quinary-color);
          border: 1px solid var(--btn-quinary-border, transparent);
        }
        .quinary:hover {
          background: var(--btn-quinary-hover);
        }

        /* DISABLED */
        .flexible-button:disabled {
          background: var(--btn-disabled-bg);
          color: var(--btn-disabled-color);
          cursor: not-allowed;
          opacity: 0.7;
          border: 1px solid var(--btn-disabled-border, transparent);
        }
      `}</style>
    </>
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
<FlexibleButton variant="quaternary">Quaternary</FlexibleButton>
<FlexibleButton variant="quinary">Quinary</FlexibleButton>
<FlexibleButton variant="primary" disabled>Disabled</FlexibleButton> */
}
