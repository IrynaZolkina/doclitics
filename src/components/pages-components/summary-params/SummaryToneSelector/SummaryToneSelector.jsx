"use client";

import styles from "./SummaryToneSelector.module.css";

export default function SummaryToneSelector({
  tones = [],
  activeIndexTone = 0,
  onChange,
}) {
  return (
    <div className={styles.blockWrapper}>
      <div className={styles.blockLargeContainer}>
        <h2>Summary Style</h2>
        <p>Choose the tone and writing style for your summary</p>

        <div className={styles.toneBlockSmallContainer}>
          {tones.map((item, index) => (
            <div
              key={index}
              onClick={() => onChange?.(index)}
              className={`${styles.chooseButtonToneContainer} ${
                activeIndexTone === index ? styles.active : ""
              }`}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") onChange?.(index);
              }}
            >
              <div className={styles.chooseButton}>{item}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
