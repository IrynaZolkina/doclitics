"use client";
import Image from "next/image";
import styles from "./dashboard.module.css";

import { useSelector } from "react-redux";
import DropZone from "../homepage/dropzone/DropZone";
import CheckIcon from "@/components-svg/CheckIcon";
import DocIcon from "@/components-svg/DocIcon";
import UploadIcon from "@/components-svg/UploadIcon";
import { useRef } from "react";
import RefreshIcon from "@/components-svg/RefreshIcon";
import ClockMiniIcon from "@/components-svg/ClockMiniIcon";

const Dashboard = ({ userSummaries, userName }) => {
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

  return (
    <div className={styles._container}>
      <div className={styles.container}>
        <div className={styles.left_panel}>
          <h2>Navigation</h2>
          <ul className={styles.navbar}>
            <li
              onClick={() => scrollToSection("dropzone")}
              className={styles.nav_button}
            >
              <UploadIcon
                width="15"
                height="15"
                // className={styles.upload_icon}
                strokeColor={"var(--text-color-blue-intens)"}
              />
              <div>
                Upload
                <p>Process new documents</p>
              </div>
            </li>
            <li
              onClick={() => scrollToSection("history")}
              className={styles.nav_button}
            >
              <RefreshIcon
                width="15"
                height="15"
                className={styles.refresh_icon}
                strokeColor={"var(--text-color-blue-intens)"}
              >
                <ClockMiniIcon />
              </RefreshIcon>

              <div>
                Upload
                <p>Process new documents</p>
              </div>
            </li>
            <li
              onClick={() => scrollToSection("analitics")}
              className={styles.nav_button}
            >
              <UploadIcon
                width="15"
                height="15"
                // className={styles.upload_icon}
                strokeColor={"var(--text-color-blue-intens)"}
              />
              <div>
                Upload
                <p>Process new documents</p>
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
          <div id="history" className={styles.array_panel}>
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
