import Image from "next/image";
import "../app/globals.css";
import styles from "./css-modules/herosection.module.css";
// import DropZone from "./DropZone";
import DropZoneN from "./DropZoneN";

const HeroSection = ({
  setChosenFile,
  setPdfDoc,
  setTotalPages,
  setExtractedTexts,
}) => {
  return (
    <div className={styles.heroContainer}>
      <div className={styles.aiIntelligence}>
        <Image src="aip.svg" alt="AI Intelligence" width={20} height={20} />
        <span>AI-Powered Document Intelligence</span>
      </div>
      <div className={styles.heading1}>
        <p>
          Transform Any Document into <span>Instant, </span>
        </p>
        <p>
          <span>Clear, Actionable Summaries.</span>
        </p>
        {/* <p>Instantly.</p> */}
      </div>
      <div className={styles.heading2}>
        <p>
          Upload any file and let Docliticss intelligent AI instantly create the
          perfect summary
        </p>
        <p>tailored precisely to your documents unique style and needs.</p>
      </div>
      <DropZoneN
        setChosenFile={setChosenFile}
        setPdfDoc={setPdfDoc}
        setTotalPages={setTotalPages}
        setExtractedTexts={setExtractedTexts}
      />
      {/* <DropZone
        setChosenFile={setChosenFile}
        setPdfDoc={setPdfDoc}
        setTotalPages={setTotalPages}
        setExtractedTexts={setExtractedTexts}
      /> */}

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
