import Image from "next/image";
import "../app/globals.css";
import styles from "./css-modules/pricesection.module.css";

const PriceSection = () => {
  return (
    <div className={styles.container}>
      <h1>
        Simple, <span>Transparent </span>Pricing
      </h1>
      <p>
        Choose the perfect plan for your needs. Start free, upgrade anytime.
      </p>
      <div className={styles.flexWrapper}>
        <div className={styles.flexContainer}>
          <h4>Free</h4>
          <p>
            <span>$0</span> /month
          </p>
          <p>Perfect for trying out Doclitic</p>

          <ul>
            <li>
              <Image src="check.svg" alt="01" width={13.33} height={13} />
              &#160;&#160;&#160; 50 tokens per month
            </li>
            <li>
              <Image src="check.svg" alt="01" width={13.33} height={13} />
              &#160;&#160;&#160; Basic document types
            </li>
            <li>
              <Image src="check.svg" alt="01" width={13.33} height={13} />
              &#160;&#160;&#160; Email support
            </li>
          </ul>
          <div className={styles.button}>Get Started</div>
        </div>

        <div className={styles.flexContainer}>
          <h4>Starter</h4>
          <p>
            <span>$15</span> /month
          </p>
          <p>Great for individuals and </p>
          <p>students </p>

          <ul>
            <li>
              <Image src="check.svg" alt="01" width={13.33} height={13} />
              &#160;&#160;&#160; 500 tokens (50 docs) per month
            </li>
            <li>
              <Image src="check.svg" alt="01" width={13.33} height={13} />
              &#160;&#160;&#160; All document types
            </li>
            <li>
              <Image src="check.svg" alt="01" width={13.33} height={13} />
              &#160;&#160;&#160; Advanced output options
            </li>
            <li>
              <Image src="check.svg" alt="01" width={13.33} height={13} />
              &#160;&#160;&#160; Summary delivered in ~30 seconds
            </li>
            <li>
              <Image src="check.svg" alt="01" width={13.33} height={13} />
              &#160;&#160;&#160; Priority email support
            </li>
          </ul>
          <button className={styles.button}>Get Started</button>
        </div>
        <div className={styles.flexContainer}>
          <h4>Professional</h4>
          <p>
            <span>$39</span> /month
          </p>
          <p>Perfect for professionals and</p>
          <p>teams</p>
          <ul>
            <li>
              <Image src="check.svg" alt="01" width={13.33} height={13} />
              &#160;&#160;&#160; Everything in Starter
            </li>
            <li>
              <Image src="check.svg" alt="01" width={13.33} height={13} />
              &#160;&#160;&#160; 2500 tokens per month
            </li>
            <li>
              <Image src="check.svg" alt="01" width={13.33} height={13} />
              &#160;&#160;&#160; Latest AI models
            </li>
            <li>
              <Image src="check.svg" alt="01" width={13.33} height={13} />
              &#160;&#160;&#160; Custom templates{" "}
            </li>
            <li>
              <Image src="check.svg" alt="01" width={13.33} height={13} />
              &#160;&#160;&#160; Highest quality insights
            </li>
            <li>
              <Image src="check.svg" alt="01" width={13.33} height={13} />
              &#160;&#160;&#160; Lightning fast processing
            </li>
          </ul>
          <button className={styles.button}>Get Started</button>
        </div>
        <div className={styles.flexContainer}>
          <h4>Max</h4>
          <p>
            <span>$129</span> /month
          </p>
          <p>For those who need the power</p>
          <p>for large scale analysis.</p>
          <ul>
            <li>
              <Image src="check.svg" alt="01" width={13.33} height={13} />
              &#160;&#160;&#160; Everything in Professional
            </li>
            <li>
              <Image src="check.svg" alt="01" width={13.33} height={13} />
              &#160;&#160;&#160; 10000 documents per month
            </li>
            <li>
              <Image src="check.svg" alt="01" width={13.33} height={13} />
              &#160;&#160;&#160; Custom Presets
            </li>
            <li>
              <Image src="check.svg" alt="01" width={13.33} height={13} />
              &#160;&#160;&#160; Priority Summarization
            </li>
            <li>
              <Image src="check.svg" alt="01" width={13.33} height={13} />
              &#160;&#160;&#160; No watermark
            </li>
          </ul>
          <button className={styles.button}>Get Started</button>
        </div>
      </div>
    </div>
  );
};

export default PriceSection;
