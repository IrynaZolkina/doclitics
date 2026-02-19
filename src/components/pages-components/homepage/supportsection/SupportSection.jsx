"use client";
import Image from "next/image";
import styles from "./supportsection.module.css";
import BagIcon from "@/components-svg/BagIcon";
import GraduationIcon from "@/components-svg/GraduationIcon";
import BookIcon from "@/components-svg/BookIcon";

const SupportSection = () => {
  return (
    <div className={styles.supportContainer}>
      {console.log("SupportSection render")}
      <h1>
        Supports Every <span>Document Type</span>
      </h1>
      <p>Our AI recognizes and adapts to different document types, ensuring</p>
      <p>your summary matches the perfect style and format for your specific</p>
      <p>needs.</p>
      <div className={styles.supportGridContainer}>
        <div>
          <section>
            <BagIcon width={30} height={30} color="#5593F7" />

            {/* <Image src="page3_01.svg" alt="01" width={36} height={36} /> */}
          </section>
          <h3>Business Reports</h3>
          <p>Executive summaries, quarterly reports,</p>
          <p>market analyses</p>
        </div>
        <div>
          <section>
            <GraduationIcon size={40} color="rgba(168, 85, 247, 1)" />
            {/* <Image src="page3_02.svg" alt="01" width={36} height={36} /> */}
          </section>
          <h3>Academic Papers</h3>
          <p>Research papers, thesis documents,</p>
          <p>scholarly articles</p>
        </div>
        <div>
          <section>
            <BookIcon size={35} color="rgba(34, 197, 94, 1)" />
            {/* <Image src="page3_03.svg" alt="01" width={36} height={36} /> */}
          </section>
          <h3>Literature Reviews</h3>
          <p>Book summaries, literature analyses,</p>
          <p>review papers</p>
        </div>
        <div>
          <section>
            <Image src="page3_04.svg" alt="01" width={36} height={36} />
          </section>
          <h3>Study Notes</h3>
          <p>Lecture notes, textbook chapters, study</p>
          <p>materials</p>
        </div>
        <div>
          <section>
            <Image src="page3_05.svg" alt="01" width={36} height={36} />
          </section>
          <h3>Technical Documentation</h3>
          <p>API docs, user manuals, technical</p>
          <p>specifications</p>
        </div>
        <div>
          <section>
            <Image src="page3_06.svg" alt="01" width={36} height={36} />
          </section>
          <h3>Personal Documents</h3>
          <p>Contracts, legal documents, personal</p>
          <p>files</p>
        </div>
      </div>

      {/* <div className={styles.anyFiledivBorder}>
        <div className={styles.anyFilediv}>
          <Image src="page3_04.svg" alt="01" width={36} height={36} />
          <h3>Any File</h3>
          <p>Input any file and recei</p>
        </div>
      </div> */}
      <div className={styles.amount}>
        <section>
          <h3>15+</h3>
          <p>File Formats</p>
        </section>
        <section>
          <h3>99.2&#37;</h3>
          <p>Accuracy Rate</p>
        </section>
        <section>
          <h3>&#60;30s</h3>
          <p>Processing Time</p>
        </section>
        <section>
          <h3>24/7</h3>
          <p>Availability</p>
        </section>
      </div>
    </div>
  );
};

export default SupportSection;
