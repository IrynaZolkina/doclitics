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
              &#160;&#160;&#160; Unlimited documents
            </li>
            <li>
              <Image src="check.svg" alt="01" width={13.33} height={13} />
              &#160;&#160;&#160; Unlimited documents
            </li>
            <li>
              <Image src="check.svg" alt="01" width={13.33} height={13} />
              &#160;&#160;&#160; Unlimited documents
            </li>
            <li>
              <Image src="check.svg" alt="01" width={13.33} height={13} />
              &#160;&#160;&#160; Unlimited documents
            </li>
            <li>
              <Image src="check.svg" alt="01" width={13.33} height={13} />
              &#160;&#160;&#160; Unlimited documents
            </li>
          </ul>
          <button className={styles.button}>Get Started</button>
        </div>
        <div className={styles.flexContainer}>
          <h4>Free</h4>
          <p>
            <span>$0</span> /month
          </p>
          <p>Perfect for trying out Doclitic</p>
          <ul>
            <li>
              <Image src="check.svg" alt="01" width={13.33} height={13} />
              &#160;&#160;&#160; Unlimited documents
            </li>
            <li>
              <Image src="check.svg" alt="01" width={13.33} height={13} />
              &#160;&#160;&#160; Unlimited documents
            </li>
            <li>
              <Image src="check.svg" alt="01" width={13.33} height={13} />
              &#160;&#160;&#160; Unlimited documents
            </li>
            <li>
              <Image src="check.svg" alt="01" width={13.33} height={13} />
              &#160;&#160;&#160; Unlimited documents
            </li>
            <li>
              <Image src="check.svg" alt="01" width={13.33} height={13} />
              &#160;&#160;&#160; Unlimited documents
            </li>
          </ul>
          <button className={styles.button}>Get Started</button>
        </div>
        <div className={styles.flexContainer}>
          <h4>Free</h4>
          <p>
            <span>$0</span> /month
          </p>
          <p>Perfect for trying out Doclitic</p>
          <ul>
            <li>
              <Image src="check.svg" alt="01" width={13.33} height={13} />
              &#160;&#160;&#160; Unlimited documents
            </li>
            <li>
              <Image src="check.svg" alt="01" width={13.33} height={13} />
              &#160;&#160;&#160; Unlimited documents
            </li>
            <li>
              <Image src="check.svg" alt="01" width={13.33} height={13} />
              &#160;&#160;&#160; Unlimited documents
            </li>
            <li>
              <Image src="check.svg" alt="01" width={13.33} height={13} />
              &#160;&#160;&#160; Unlimited documents
            </li>
            <li>
              <Image src="check.svg" alt="01" width={13.33} height={13} />
              &#160;&#160;&#160; Unlimited documents
            </li>
          </ul>
          <button className={styles.button}>Get Started</button>
        </div>
        <div className={styles.flexContainer}>
          <h4>Free</h4>
          <p>
            <span>$0</span> /month
          </p>
          <p>Perfect for trying out Doclitic</p>
          <ul>
            <li>
              <Image src="check.svg" alt="01" width={13.33} height={13} />
              &#160;&#160;&#160; Unlimited documents
            </li>
            <li>
              <Image src="check.svg" alt="01" width={13.33} height={13} />
              &#160;&#160;&#160; Unlimited documents
            </li>
            <li>
              <Image src="check.svg" alt="01" width={13.33} height={13} />
              &#160;&#160;&#160; Unlimited documents
            </li>
            <li>
              <Image src="check.svg" alt="01" width={13.33} height={13} />
              &#160;&#160;&#160; Unlimited documents
            </li>
            <li>
              <Image src="check.svg" alt="01" width={13.33} height={13} />
              &#160;&#160;&#160; Unlimited documents
            </li>
          </ul>
          <button className={styles.button}>Get Started</button>
        </div>
      </div>
    </div>
  );
};

export default PriceSection;
