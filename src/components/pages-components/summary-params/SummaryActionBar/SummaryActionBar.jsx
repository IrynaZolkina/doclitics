"use client";

import FourStar from "@/components-svg/FourStar";
import styles from "./SummaryActionBar.module.css";
import FlexibleButton from "@/components-ui/buttons/FlexibleButton";

export default function SummaryActionBar({
  docsLeft = 0,
  isGenerating = false,
  onGenerate,
}) {
  return (
    <div className={styles.summary_button_area}>
      <div className={styles.summary_button}>
        <div className={styles.buttonAndText}>
          <div className={styles.buttonTokenCost}>
            Documents Left
            <div className={styles.tokenCostNumber}>{docsLeft}</div>
          </div>
          <FourStar /> Documents are deducted when generation starts (refunded
          if generation fails).
        </div>

        <FlexibleButton
          onClick={onGenerate}
          disabled={isGenerating}
          icon={<FourStar />}
          fontSize={"18px"}
          fontFamily="Manrope, sans-serif"
          hoverBackground="#2A3F6A"
          padding="7px 20px"
        >
          {isGenerating ? "Generating..." : "Generate Summary!"}
        </FlexibleButton>
      </div>
    </div>
  );
}
