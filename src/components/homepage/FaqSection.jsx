"use client";
import styles from "@/z-css-modules/components/homepage/faqsection.module.css";

import { useState } from "react";

import HalfArrowDown from "@/components-ui/svg-components/HalfArrowDown";

const faqArray = [
  {
    id: 1,
    question: "What document types do you support?",
    answer:
      "PDF, DOCX, TXT, and files. Our AI automatically picks the best summary format for your content.",
  },
  {
    id: 2,
    question: "How does the token system work?",
    answer:
      "Each document costs tokens based on its length:\n- 1-10 pages = 1 token\n- 11-50 pages = 2 tokens\n- 51+ pages = 3 tokens\n\nPlans include:\n- Starter: 50 tokens/month (~10-50 docs)\n- Professional: 250 tokens/month (~50-250 docs)\n- Max: 500+ tokens/month (~100-500+ docs)",
  },
  {
    id: 3,
    question: "Can I upload multiple documents at once?",
    answer:
      "Not currently. We process one document at a time for optimal quality.",
  },
  {
    id: 4,
    question: "How does the AI choose the summary format?",
    answer:
      "It analyzes your document type (e.g., contract vs. research paper) to generate the most suitable template automatically.",
  },
  {
    id: 5,
    question: "Can I edit the AI-generated summary?",
    answer: "Yes! You can tweak summaries after they're created.",
  },
  {
    id: 6,
    question: "How accurate are the summaries?",
    answer:
      "99% accuracy, and we have an advanced summary mode for complex technical/specialized content.",
  },
  {
    id: 7,
    question: "How fast is processing?",
    answer:
      "<30 seconds for most documents. 50+ pages may take up to 2 minutes.",
  },
  {
    id: 8,
    question: "Is my data stored or shared?",
    answer:
      "No. We use military-grade encryption and delete originals after processing.",
  },
  {
    id: 9,
    question: "Need more tokens?",
    answer: "Upgrade anytime or [contact us](#) for enterprise solutions.",
  },
];

const FaqSection = () => {
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (index) => {
    setOpenItems((prev) => ({
      ...prev,
      [index]: !prev[index], // toggle only this one
    }));
  };
  return (
    <div className={styles.container}>
      <h1>
        Frequently Asked <span>Questions</span>
      </h1>
      <p>
        Everything you need to know about Doclitic. Can&apos;t find what
        you&apos;re
      </p>
      <p>looking for? Contact our support team.</p>
      <div className={styles.questionsContainer}>
        {faqArray.map((faq, index) => (
          <div key={index} className={styles.question}>
            <div className={styles.q}>
              <h3>{faq.question}</h3>
              <button
                onClick={() => toggleItem(index)}
                // style={{
                //   fontSize: "14px",
                //   padding: "5px 10px",

                //   color: "white",
                //   border: "none",
                //   borderRadius: "5px",
                //   cursor: "pointer",
                // }}
              >
                {/* {openItems[index] ? "Hide" : <HalfArrowDown isOpen={} />} */}
                <HalfArrowDown isOpen={openItems[index]} />
              </button>
            </div>
            <div className={styles.answer}>
              {openItems[index] && <div>{faq.answer}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FaqSection;
