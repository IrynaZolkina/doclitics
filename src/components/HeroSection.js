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
        <h2>Drop your document here</h2>
        <p>Or click to browse &#11050; Supports PDF, DOC, TXT and more</p>
        <button className={styles.chooseFileButton}>
          <Image
            //className={styles.dropIcon}
            src="choosefile.svg"
            alt="drop"
            width={24}
            height={24}
          />
          <span>Choose File</span>
        </button>
      </div>
      <div className={styles.heroTwoButtonsContainer}>
        <button>Start Summarizing for Free</button>
        <button>Watch Demo</button>
      </div>
      <div className={styles.heroDownBlock}>
        <span></span>
        <span>99&#37; Accuracy</span>
        <span></span>
        <span>10k+ Documents Processed</span>
        <span></span>
        <span>Enterprise Security</span>
      </div>
    </div>
  );
};

export default HeroSection;
