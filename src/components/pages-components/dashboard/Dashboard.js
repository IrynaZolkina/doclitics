"use client";
import Image from "next/image";
import styles from "./dashboard.module.css";

import { useSelector } from "react-redux";
import DropZone from "../homepage/dropzone/DropZone";
import CheckIcon from "@/components-svg/CheckIcon";
import DocIcon from "@/components-svg/DocIcon";
import UploadIcon from "@/components-svg/UploadIcon";
import { useEffect, useRef, useState } from "react";

import HistoryRefreshIcon from "@/components-svg/HistoryRefreshIcon";
import PieChartIcon from "@/components-svg/PieChartIcon";

const Dashboard = ({ userSummaries, userName }) => {
  const [activeSection, setActiveSection] = useState("dropzone");

  // const user = useSelector((state) => state.user);
  const contentRef = useRef(null);
  const scrollToSection = (href) => {
    const element = document.getElementById(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }

    // const yOffset = 0; // adjust if needed
    // const y =
    //   element.getBoundingClientRect().top + window.pageYOffset + yOffset;

    // window.scrollTo({
    //   top: y,
    //   behavior: "smooth",
    // });
  };
  // useEffect(() => {
  //   const sections = ["dropzone", "history", "analitics"];

  //   const observer = new IntersectionObserver(
  //     (entries) => {
  //       entries.forEach((entry) => {
  //         if (entry.isIntersecting) {
  //           setActiveSection(entry.target.id);
  //         }
  //       });
  //     },
  //     {
  //       threshold: 0.6,
  //     },
  //   );

  //   sections.forEach((id) => {
  //     const el = document.getElementById(id);
  //     if (el) observer.observe(el);
  //   });

  //   return () => observer.disconnect();
  // }, []);
  return (
    <div className={styles._container}>
      <div className={styles.container}>
        <div className={styles.left_panel}>
          <h2>Navigation</h2>
          <ul className={styles.navbar}>
            <li
              onClick={() => {
                (scrollToSection("dropzone"), setActiveSection("dropone"));
              }}
              className={`${styles.nav_button} ${
                activeSection === "dropzone" ? styles.active : ""
              }`}
            >
              <UploadIcon width="15" height="15" />
              <div>
                Upload
                <p>Process new documents</p>
              </div>
            </li>
            <li
              onClick={() => {
                (scrollToSection("history"), setActiveSection("history"));
              }}
              className={`${styles.nav_button} ${
                activeSection === "history" ? styles.active : ""
              }`}
            >
              <HistoryRefreshIcon width="15" height="15" />

              <div>
                History
                <p>View past summaries</p>
              </div>
            </li>
            <li
              onClick={() => {
                (scrollToSection("analitics"), setActiveSection("analitics"));
              }}
              className={`${styles.nav_button} ${
                activeSection === "analitics" ? styles.active : ""
              }`}
            >
              <PieChartIcon />
              <div>
                Analytics
                <p>View your stats</p>
              </div>
            </li>
          </ul>
        </div>
        <div ref={contentRef} id="dropzone" className={styles.center_panel}>
          <h1>
            <span>Hello,</span> {userName}! 👋{" "}
          </h1>
          <p>Ready to transform your documents into intelligent summaries?</p>
          <div className={styles.controls}>
            <DropZone />
          </div>
          <div id="history" className={styles.history_id}></div>
          <div className={styles.array_panel}>
            <h2>Recent Summaries </h2>
            <p>
              Your document processing <span>saved up to 30 days</span>
            </p>
            <div className={styles.list}>
              {userSummaries.map((item) => (
                // <Link href={item.href} key={item.label}>
                <div key={item.createdAt} className={styles.list_item}>
                  <div className={styles.list_item_filename}>
                    <DocIcon strokeColor={"rgba(248, 113, 113, 1)"} />
                    <div>
                      {item.fileName || "mmmmmmmmmmmm"}
                      <div className={styles.list_item_date_number}>
                        <span>one</span> two
                      </div>
                    </div>
                  </div>
                  <div
                    onClick={() => {}}
                    // reviewsRef.current?.scrollIntoView({ behavior: "smooth" })

                    className={styles.check_icon}
                  >
                    <CheckIcon />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <h1 id="analitics">Your Analytics</h1>
          <p>Track your document processing performance and usage patterns</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
