"use client";
import React from "react";
import styles from "../css-modules/summarypage.module.css";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import IndeterminateProgressBar from "@/components-ui/IndeterminateProgressBar";
import { clearSummary } from "@/redux/store";
// import remarkGfm from "remark-gfm";
import emojiRegex from "emoji-regex";
import MarkdownRenderer from "./MarkdownRenderer";
// import html2pdf from "html2pdf.js";

// import { Smile, Star, Fire } from "./icons";

export default function Summary() {
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownLoading, setIsDownLoading] = useState(false);
  const dispatch = useDispatch();
  const firstMount = useRef(true);
  const choices = useSelector((state) => state.summary.choices);
  const type = useSelector((state) => state.file.tone);
  const depth = useSelector((state) => state.file.depth);

  // Stop loading when choices arrive
  useEffect(() => {
    // if (choices && choices.length > 0) {
    //   setIsLoading(false);
    // }
    if (choices) {
      setIsLoading(false);
    }
  }, [choices]);
  const pdfRef = useRef(null);

  async function downloadPdf(markdon, title = "fgfugfufuf") {
    //     const markdown = `
    // # Hello World 🎉
    // This **Markdown** has some emojis, but they will be removed in PDF.

    // - Item 1 ✅
    // - Item 2 ⚠️
    // `;
    const markdown = choices;
    const res = await fetch("/api/export-pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markdown, title }),
    });

    if (!res.ok) return console.error("Failed to generate PDF");

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title}.pdf`;
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  // // react-markdown component override for text nodes
  // const components = {
  //   // `text` renders all plain text nodes
  //   text({ children }) {
  //     console.log("text node:", children);
  //     const text = Array.isArray(children)
  //       ? children.join("")
  //       : String(children);
  //     return <>{renderTextWithSVG(text)}</>;
  //   },
  // };

  // if (isLoading) {
  //   return (
  //     <div>
  //       <div
  //         style={{ marginTop: "150px", textAlign: "center", height: "100vh" }}
  //       >
  //         <IndeterminateProgressBar isLoading={isLoading} />
  //       </div>
  //       <Link href="/pages/viewer">Back to Viewer</Link>
  //     </div>
  //   );
  // }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.blurCircle}></div>
      {/* <div className={styles.blockWrapper}></div> */}
      {/* {choices.map((choice, index) => (
        <ReactMarkdown key={index}>{choice.message.content}</ReactMarkdown>
        ))} */}

      <h1>Your Summary is Ready 🚀</h1>
      <button
        // disabled={choices === ""}
        onClick={downloadPdf}
        // onClick={handleDownload}
        style={{
          background: "#0070f3",
          color: "white",
          border: "none",
          borderRadius: "6px",
          padding: "10px 20px",
          cursor: "pointer",
          marginBottom: "20px",
        }}
      >
        Download PDF
      </button>
      <div className={styles.summaryContainer}>
        <div
          ref={pdfRef}
          id="pdf-content"
          // style={{
          //   background: "white",
          //   padding: "20px",
          //   color: "black",
          // }}
          className="markdown"
        >
          <MarkdownRenderer content={choices} />
        </div>
        <div className={styles.infoBox}>
          <div>
            <span>Total Tokens Used</span>
            <span>9</span>
          </div>
          <div>
            <span>Summary Length</span>
            <span>750 words</span>
          </div>
          <div>
            <span>Document Type</span>
            <span>Business Report</span>
          </div>
          <div>
            <span>Summary Style</span>
            <span>Formal</span>
          </div>
          <div>
            <span>Time Taken</span>
            <span>12s</span>
          </div>
        </div>
      </div>
      {/* <Link href="/pages/viewer">Back to Viewer</Link> */}
      {/* <div style={{ marginTop: "150px", textAlign: "center" }}>
        <IndeterminateProgressBar isLoading={true} />
      </div> */}
    </div>
  );
}
