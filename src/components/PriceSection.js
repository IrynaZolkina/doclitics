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
        Industry-leading security protocols, end-to-end encryption, and strict
        privacy policies
      </p>
      <p>ensure complete confidentiality for your sensitive documents.</p>
    </div>
  );
};

export default PriceSection;
