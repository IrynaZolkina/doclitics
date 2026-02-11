"use client";

import styles from "./AdditionalInstructions.module.css";

export default function AdditionalInstructions({
  value,
  onChange,
  placeholder = "E.g. focus on key metrics, skip introductions, highlight action items...",
  helperText = "Optional, but helps improve accuracy",
}) {
  return (
    <div className={styles.blockWrapper}>
      <div className={styles.blockLargeContainer}>
        <h2>Additional Instructions</h2>
        <p>Add any specific requirements or focus areas for your summary</p>

        <div className={styles.blockContainer4}>
          <textarea
            value={value}
            className={styles.inputAdditional}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={placeholder}
          />
        </div>

        <p className={styles.helperText}>{helperText}</p>
      </div>
    </div>
  );
}
