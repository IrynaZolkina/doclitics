import "../app/globals.css";
import styles from "./css-modules/loved.module.css";

import Star from "@/components-ui/svg-components/Star";
import Comma from "@/components-ui/svg-components/Comma";
import React from "react";

const infoArray = [
  {
    text: "Doclitic has transformed how our team processes documents. What used to take hours now takes minutes and the quality is consistently excellent.",
    author: "Sarah Chen",
    prof: "Research Director",
    ab: "SC",
  },
  {
    text: "As a graduate student, Doclitic helps me quickly understand complex papers and create study notes. It's like having a research assistant 24/7.",
    author: "Michael Rodriguez",
    prof: "PhD Student",
    ab: "MR",
  },
  {
    text: "The AI perfectly captures the essence of our business reports. Our executives love the concise summaries for quick decision-making.",
    author: "Emily Watson",
    prof: "Business Analyst",
    ab: "EW",
  },
  {
    text: "Doclitic's document analysis capabilities are impressive. It understands speficic terminology and creates summaries that are actually accurate.",
    author: "David Kim",
    prof: "Legal Consultant",
    ab: "DK",
  },
  {
    text: "The variety of document types Doclitic handles is amazing. From presentations and technical docs to creative briefs, it always delivers the right summary style.",
    author: "Lisa Thompson",
    prof: "Content Manager",
    ab: "LT",
  },
  {
    text: "Doclitic helps me stay on top of industry reports and investor documents. The time savings allow me to focus on growing my business.",
    author: "James Park",
    prof: "Startup Founder",
    ab: "JP",
  },
];

const Loved = () => {
  return (
    <div className={styles.container}>
      <h1>
        Loved by <span>Thousands</span>
      </h1>
      <p>The testimonials of users who use Doclitics Daily.</p>
      <div className={styles.gridContainer}>
        {infoArray.map((item) => (
          // <Link href={item.href} key={item.label}>
          <div key={item.author} className={styles.cartBox}>
            <Comma />
            <span>
              <Comma />
            </span>
            <p>"{item.text}"</p>
            <div className={styles.logoBlok}>
              <div className={styles.star}>
                <span>
                  <Star />
                  &nbsp;
                  <Star />
                  &nbsp;
                  <Star />
                  &nbsp;
                  <Star />
                  &nbsp;
                  <Star />
                </span>
              </div>
              <div className={styles.flexBoxic}>
                <div className={styles.logoBox}>{item.ab}</div>
                <div className={styles.prof}>
                  <h4>{item.author}</h4>
                  <h5> {item.prof}</h5>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loved;
