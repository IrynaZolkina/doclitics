import Image from "next/image";
import "../app/globals.css";
import styles from "./css-modules/herosection.module.css";

const HeroSection = () => {
  return (
    <div className={styles.heroContainer}>
      <div className={styles.aiIntelligence}>
        <Image src="aip.svg" alt="AI Intelligence" width={20} height={20} />
        <span>AI-Powered Document Intelligence</span>
      </div>
      <div className={styles.heading1}>
        <p>
          Turn Your Documents into <span>Stunning</span>
        </p>
        <p>
          <span>Summaries.</span>
        </p>
        <p>Instantly.</p>
      </div>
    </div>
  );
};

export default HeroSection;
