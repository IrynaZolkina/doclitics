import Image from "next/image";
import "../app/globals.css";
import styles from "./css-modules/howworkssection.module.css";

const HowWorksSection = () => {
  return (
    <div className={styles.howWorksContainer}>
      <h1>
        How <span> Doclitics </span> Works
      </h1>
      <p>
        Three simple steps to transform any document into a perfectly crafted
      </p>
      <p>summary</p>
      <div className={styles.section1}>
        <div className={styles.section1block}>
          <h1>01</h1>
          <div className={styles.page2Icons}>
            <Image src="page2_01.svg" alt="01" width={36} height={36} />
          </div>
          <h3>Upload Your Document</h3>
          <p>Simply drag & drop or select any file type.</p>
          <p>Our platform supports PDFs, Word docs,/p</p>
          <p>text files, and more.</p>
        </div>
        <Image src="page2_04.svg" alt="01" width={24} height={24} />
        <div className={styles.section1block}>
          <h1>02</h1>
          <div className={styles.page2Icons}>
            <Image src="page2_02.svg" alt="01" width={36} height={36} />
          </div>
          <h3>AI Analyzes Your File</h3>
          <p>Noora&#39;s advanced AI intelligently identifies</p>
          <p>document type and applies the perfect</p>
          <p>summarization strategy.</p>
        </div>
        <Image src="page2_04.svg" alt="01" width={24} height={24} />
        <div className={styles.section1block}>
          <h1>03</h1>
          <div className={styles.page2Icons}>
            <Image src="page2_03.svg" alt="01" width={36} height={36} />
          </div>
          <h3>Get Custom Summary</h3>
          <p>Receive a beautifully formatted summary</p>
          <p>tailored specifically to your document&#39;s</p>
          <p>purpose and style.</p>
        </div>
      </div>
      <div className={styles.section2}>
        <h1>See the Magic in Action</h1>
        <div className={styles.section2blocksGroup}>
          <div>
            <p>Watch as your complex 50-page business report</p>
            <p>transforms into a concise, actionable summary</p>
            <p>seconds.</p>
          </div>
          <div className={styles.divBlock}>
            <div className={styles.lineOfBalls}>
              <div></div>
              <div></div>
              <div></div>
            </div>
            <div className={styles.blockLine}></div>
          </div>
        </div>
        <div className={styles.lineOfBallsDown}>
          <div></div>
          <div></div>
          <div></div>
          <span>Trusted by 10,000+ users</span>
        </div>
      </div>
    </div>
  );
};

export default HowWorksSection;
