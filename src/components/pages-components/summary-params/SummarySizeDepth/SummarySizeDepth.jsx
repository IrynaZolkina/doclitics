"use client";

import styles from "./SummarySizeDepth.module.css";
import SliderRange from "@/components-ui/z-others/SliderRange";

export default function SummarySizeDepth({
  value,
  onChange,
  min = 300,
  max = 1300,
  step = 10,
  initial = 800,
}) {
  const rounded = Math.round(value / 100) * 100;

  return (
    <div className={styles.blockWrapper}>
      <div className={styles.blockLargeContainer}>
        <h2>Summary Size & Depth</h2>
        <p>Adjust the length and detail level of your summary</p>

        <div className={styles.sliderRange}>
          <SliderRange
            min={min}
            max={max}
            thumbWidth={50}
            step={step}
            value={value}
            setValue={onChange}
            initial={initial}
          />
        </div>

        <div className={styles.smallMediumLargeBox}>
          <span>Small</span>
          <span className={styles.mediumLabel}>Medium</span>
          <span>Large</span>
        </div>

        <div className={styles.estimatedBox}>
          <span className={styles.estimatedLeft}>
            ⓘ{" "}
            <span className={styles.estimatedLeftText}>
              &nbsp;Estimated Length
            </span>
          </span>

          <span className={styles.estimatedRight}>
            ~&nbsp;{rounded}&nbsp;
            <span className={styles.wordsLabel}>words</span>
          </span>
        </div>
      </div>
    </div>
  );
}
