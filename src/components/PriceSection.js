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
          <p>Basic features for individuals and small teams.</p>
          <p>Limited document processing per month.</p>
          <button className={styles.button}>Get Started</button>
        </div>
      </div>
    </div>
  );
};

export default PriceSection;
