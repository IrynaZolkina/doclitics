"use client";
import Image from "next/image";
import "../app/globals.css";
import styles from "./css-modules/dashboard.module.css";
const summariesArray = [
  { fileName: "Sample Business Report.pdf", size: "344" },
  { fileName: "Sample Business Report1.pdf", size: "344" },
  { fileName: "Sample Business Report2.pdf", size: "344" },
  { fileName: "Sample Business Report3.pdf", size: "344" },
  { fileName: "Sample Business Report4.pdf", size: "344" },
  { fileName: "Sample Business Report5.pdf", size: "344" },
];
const Dashboard = ({ fileName }) => {
  return (
    <div className={styles.container}>
      <h1>Welcome to your Dashboard, Andrii</h1>
      <p>To create your first summary, drag & Drop or select a file</p>
      <div className={styles.gridContainer}>
        <div className={styles.flexContainerLeftWrapper}>
          <div
            className={`${styles.flexContainer} ${styles.flexContainerLeft}`}
          >
            {summariesArray.map((item) => (
              // <Link href={item.href} key={item.label}>
              <div key={item.fileName} className="">
                {item.fileName}
                <span
                  onClick={() => {}}
                  // reviewsRef.current?.scrollIntoView({ behavior: "smooth" })

                  className={styles.arrow}
                >
                  <Image src="page2_04.svg" alt="01" width={24} height={24} />
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className={`${styles.flexContainer} ${styles.flexContainerRight}`}>
          <h2>Selected File:</h2>
          <div className={styles.selectedFileBox}>{fileName}</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
