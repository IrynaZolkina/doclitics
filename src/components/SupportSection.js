import Image from "next/image";
import "../app/globals.css";
import styles from "./css-modules/supportsection.module.css";

const SupportSection = () => {
  return (
    <div className={styles.supportContainer}>
      <h1>
        Supports Every <span>Document Type</span>
      </h1>
      <p>Our AI recognizes and adapts to different document types, ensuring</p>
      <p>your summary matches the perfect style and format for your specific</p>
      <p>needs.</p>
      <div className={styles.supportGridContainer}>
        <div>
          <section>
            <Image src="page3_01.svg" alt="01" width={36} height={36} />
          </section>
          <h3>Business Reports</h3>
          <p>Executive summaries, quarterly reports,</p>
          <p>market analyses</p>
        </div>
        <div>
          <section>
            <Image src="page3_02.svg" alt="01" width={36} height={36} />
          </section>
          <h3>Academic Paperss</h3>
          <p>Research papers, thesis documents,</p>
          <p>scholarly articles</p>
        </div>
        <div>
          <section>
            <Image src="page3_03.svg" alt="01" width={36} height={36} />
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
    </div>
  );
};

export default SupportSection;
