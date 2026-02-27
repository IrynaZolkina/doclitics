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
import { useRouter } from "next/navigation";

const Dashboard = ({ userSummaries, userName }) => {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("dropzone");
  const user = useSelector((state) => state.user);

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
    // <div className={styles._container}>
    <div className={styles.container}>
      <div className={styles.left_panel_container}>
        <div className={styles.left_panel}>
          <h2>Navigation</h2>
          <ul className={styles.navbar}>
            <li
              onClick={() => {
                (scrollToSection("dropzone"), setActiveSection("dropzone"));
              }}
              className={`${styles.nav_button} ${
                activeSection === "dropzone" ? styles.active : ""
              }`}
            >
              <UploadIcon width="15" height="15" color="#5593F7" />
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
          {/* <div className={styles.quick_stats_element}>
            <UploadIcon width="15" height="15" color="#5593F7" />
            <div>
              <h4>27</h4>
              <p>Documents left this month</p>
            </div>
          </div>
          <div className={styles.quick_stats_element}>
            <UploadIcon width="15" height="15" color="#5593F7" />
            <div>
              <h4>27</h4>
              <p>Documents left this month</p>
            </div>
          </div> */}
          <div
            onClick={() => router.push("/profile")}
            className={styles.profile}
          >
            <UploadIcon width="15" height="15" color="#5593F7" />
            <div>
              <h4>Profile</h4>
              <p>View your preferences </p>
            </div>
          </div>
        </div>
      </div>
      {/* </div> */}

      <div ref={contentRef} id="dropzone" className={styles.center_panel}>
        <h1>
          <span>Hello,</span> {userName}! 👋{" "}
        </h1>
        <p>Ready to transform your documents into intelligent summaries?</p>
        <div className={styles.remaining}>
          Summaries Remaining:
          <span>&nbsp;{user.docsAmount ? user.docsAmount : ""}</span>
        </div>
        <div className={styles.dropzone_container}>
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
            <div>
              <p>Documents Left in Your Plan</p>
              <h1>{user.docsAmount ? user.docsAmount : ""}</h1>
            </div>
            <section className={styles.icon_circle}>
              <DocIcon
                width={24}
                height={24}
                strokeColor={"rgba(192, 132, 252, 1)"}
              />
            </section>
          </div>
          <div className={styles.analitics_greed_section}>
            <div>
              <p>Summaries Made in the last 30 days.</p>
              <h1>44</h1>
            </div>
            <section className={styles.icon_circle}>
              <DocIcon
                width={24}
                height={24}
                strokeColor={"rgba(112, 245, 132, 1)"}
              />
            </section>
          </div>
          <div className={styles.analitics_greed_section}>
            <div>
              <h1>345</h1> <p>Total Summaries</p>
            </div>
            <section className={styles.icon_circle}>
              <DocIcon
                width={24}
                height={24}
                strokeColor={"rgba(227, 246, 60, 1)"}
              />
            </section>
          </div>
          <div className={styles.analitics_greed_section}>
            <div>
              <h1>12345</h1>
              <p>Total Words Processed</p>
            </div>
            <section className={styles.icon_circle}>
              <DocIcon
                width={24}
                height={24}
                strokeColor={"rgba(96, 165, 250, 1)"}
              />
            </section>
          </div>
        </div>
      </div>
    </div>
    // </div>
  );
};

export default Dashboard;
