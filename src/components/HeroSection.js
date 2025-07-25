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
      <div className={styles.heading2}>
        <p>
          Upload any file and let Docliticss intelligent AI instantly create the
          perfect summary
        </p>
        <p>tailored precisely to your documents unique style and needs.</p>
      </div>
      <div className={styles.heroDivImage}>
        <Image
          className={styles.heroImage}
          src="aiimage.svg"
          alt="Hero Image"
          width={892}
          height={348}
        />

        <div className={styles.heroBlurImage}></div>
        <Image
          className={styles.dropIcon}
          src="drop.svg"
          alt="drop"
          width={64}
          height={64}
        />
        <p>Drop your document here</p>
        <p>Or click to browse Supports PDF DOC TXT and more</p>
      </div>
    </div>
  );
};

export default HeroSection;
