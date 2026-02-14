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
import CalendarIcon from "@/components-svg/CalendarIcon";

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
        <div className={`${styles.left_panel} ${styles.left_panel_down}`}>
          {" "}
          <h2>Quick Stats</h2>
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
                  <div className={styles.list_item_filename_and_attr}>
                    <DocIcon strokeColor={"rgba(248, 113, 113, 1)"} />
                    <div className={styles.list_item_filename}>
                      <h4>{item.fileName || "mmmmmmmmmmmm"}</h4>
                      <div className={styles.list_item_date_number}>
                        <h4>
                          <CalendarIcon
                            size={12}
                            color={" var(--text-color-blue)"}
                          />
                          {new Date(item.createdAt).toLocaleString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </h4>
                        <h5>
                          <DocIcon
                            width={12}
                            height={12}
                            strokeColor={" var(--text-color-blue)"}
                          />
                          {item.summary_text_length} words
                        </h5>
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
          <div className={styles.analitics_greed}>
            <div className={styles.analitics_greed_section}>
              Total Summaries
            </div>
            <div className={styles.analitics_greed_section}>
              Avg Summary Length
            </div>
            <div className={styles.analitics_greed_section}>
              Summaries Made in the last 30 days.{" "}
            </div>
            <div className={styles.analitics_greed_section}>
              Documents Left in Your Plan
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
