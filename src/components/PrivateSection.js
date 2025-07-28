import Image from "next/image";
import "../app/globals.css";
import styles from "./css-modules/privatsection.module.css";
import React from "react";

const PrivateSection = () => {
  return (
    <div className={styles.container}>
      <h1>
        Your Data Stays <span>Private</span>
      </h1>
      <p>
        Industry-leading security protocols, end-to-end encryption, and strict
        privacy policies
      </p>
      <p>ensure complete confidentiality for your sensitive documents.</p>
      <div className={styles.gridContainer}>
        <div>
          <section>
            <Image src="page4_01.svg" alt="01" width={32} height={32} />
          </section>
          <h3>End-to-End Encryption</h3>
          <p>Your documents are encrypted during upload,</p>
          <p>processing, and storage with industry-standard</p>
          <p>AES-256 encryption.</p>
        </div>
        <div>
          <section>
            <Image src="page4_02.svg" alt="01" width={32} height={32} />
          </section>
          <h3>Privacy First</h3>
          <p>We never store your Zerodocuments permanently. Files</p>
          <p>are automatically deleted after processing is</p>
          <p>complete.</p>
        </div>
        <div>
          <section>
            <Image src="page4_03.svg" alt="01" width={32} height={32} />
          </section>
          <h3>Zero Data Retention</h3>
          <p>Your content remains private. We don't use your</p>
          <p>documents to train our AI models or for any other</p>
          <p>purposes.</p>
        </div>
        <div>
          <section>
            <Image src="page4_04.svg" alt="01" width={32} height={32} />
          </section>
          <h3>Compliance Ready</h3>
          <p>GDPR, CCPA, and SOC 2 compliant. Enterprise-</p>
          <p>grade security for organizations of all sizes.</p>
        </div>
      </div>
      <div className={styles.downblock}>
        <h2>Trusted by Enterprise Customers</h2>
        <p>
          Our security standards meet the requirements of the world's most
          security-conscious organizations.
        </p>
        <main>
          <div className={styles.flexContainer}>
            <section>
              <Image src="page4_05.svg" alt="01" width={32} height={32} />
            </section>
            <p>SOC 2</p>
            <p>Type II</p>
          </div>
          <div className={styles.flexContainer}>
            <section>
              <Image src="page4_06.svg" alt="01" width={32} height={32} />
            </section>
            <p>GDPR</p>
            <p>Compliant</p>
          </div>
          <div className={styles.flexContainer}>
            <section>
              <Image src="page4_07.svg" alt="01" width={32} height={32} />
            </section>
            <p>ISO 27001</p>
            <p>Certified</p>
          </div>
          <div className={styles.flexContainer}>
            <section>
              <Image src="page4_08.svg" alt="01" width={32} height={32} />
            </section>
            <p>CCPA</p>
            <p>Compliant</p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PrivateSection;
