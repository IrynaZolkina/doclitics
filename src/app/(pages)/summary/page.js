"use client";
import styles from "./summarypage.module.css";

import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import IndeterminateProgressBar from "@/components-ui/z-others/IndeterminateProgressBar";
import { clearSummary } from "@/redux/store";
// import remarkGfm from "remark-gfm";
import emojiRegex from "emoji-regex";
import MarkdownRenderer from "./MarkdownRenderer";
import GeneratingScreen from "@/components/pages-components/summary/GeneratingScreen/GeneratingScreen";
import { apiFetch } from "@/lib/apiFetch";
// import html2pdf from "html2pdf.js";
// function countWords(str) {
//   if (!str.trim()) return 0;
//   return str.trim().split(/+/).length;
// }
function countWords(str) {
  if (!str || typeof str !== "string") return 0;
  return str.split(/[ \t\n]+/).filter(Boolean).length;
}
// import { Smile, Star, Fire } from "./icons";

export default function Summary() {
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(true);
  const [isDownLoading, setIsDownLoading] = useState(false);
  const dispatch = useDispatch();
  const firstMount = useRef(true);
  // const choices = useSelector((state) => state.summary);
  const choices = useSelector((state) => state.summary.choices);
  const type = useSelector((state) => state.file.tone);
  const depth = useSelector((state) => state.file.depth);
  const style = useSelector((state) => state.file.style);

  const [isLoading, setIsLoading] = useState(true);
  const [isPdfReady, setIsPdfReady] = useState(false);

  // ✅ prevents double-saving (Strict Mode + re-renders)
  const savedKeyRef = useRef(null);
  // Create a stable “key” for current summary
  const summaryKey =
    typeof choices === "string" && choices.length > 0
      ? `${choices.length}:${choices.slice(0, 120)}`
      : null;

  useEffect(() => {
    // if (choices && choices.length > 0) {
    //   setIsLoading(false);
    // }
    if (choices && choices.length > 0) {
      console.log("choices arrived:", choices);
      console.log("........choices.length:", choices.length);
      console.log("countWords:", countWords(choices));
      setIsPdfReady(true);
      setIsLoading(false);
    } else {
      setIsPdfReady(false);
      setIsLoading(true);
    }
  }, [choices]);

  const save_summary_to_db = useCallback(async () => {
    if (!choices || choices.length === 0) return;

    // ✅ already saved this exact summary
    if (savedKeyRef.current === summaryKey) return;
    savedKeyRef.current = summaryKey;

    const res = await apiFetch("/api/save-summary-db", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        summary_text: choices,
        summary_text_length: countWords(choices),
      }),
    });

    // optional: if save failed, allow retry next render
    if (!res || !res.ok) {
      savedKeyRef.current = null;
      return;
    }

    const data = await res.json();

    // ✅ if your API returns remaining docsAmount
    if (typeof data?.docsAmount === "number") {
      dispatch(setDocsAmount(data.docsAmount));
    }
  }, [choices, summaryKey]);

  useEffect(() => {
    // if (choices && choices.length > 0) {
    //   setIsLoading(false);
    // }
    if (choices && choices.length > 0) {
      // save_summary_to_db();
    }
  }, [choices]);
  // }, [choices, save_summary_to_db]);

  // const pdfRef = useRef(null);

  async function downloadPdf(markdon, title = "summary") {
    //     const markdown = `
    // # Hello World 🎉
    // This **Markdown** has some emojis, but they will be removed in PDF.

    // - Item 1 ✅
    // - Item 2 ⚠️
    // `;
    const markdown = choices;
    const res = await apiFetch("/api/export-pdf", {
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
  if (isLoading) {
    return (
      <div>
        <div
          style={{ marginTop: "150px", textAlign: "center", height: "60vh" }}
        >
          {/* <IndeterminateProgressBar isLoading={isLoading} /> */}
          <GeneratingScreen />;
        </div>
      </div>
    );
  }

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
        disabled={!isPdfReady}
        style={{
          background: isPdfReady ? "#0070f3" : "#aaa",
          color: "white",
          border: "none",
          borderRadius: "6px",
          padding: "10px 20px",
          cursor: isPdfReady ? "pointer" : "not-allowed",
          marginBottom: "20px",
        }}
      >
        Download PDF
      </button>
      <div className={styles.summaryContainer}>
        <div
          // ref={pdfRef}
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
            <span>{countWords(choices)} words</span>
          </div>
          <div>
            <span>Document Type</span>
            <span>{type}</span>
          </div>
          <div>
            <span>Summary Style</span>
            <span>{style}</span>
          </div>
          {/* <div>
            <span>Time Taken</span>
            <span>12s</span>
          </div> */}
        </div>
      </div>
      {/* <Link href="/pages/viewer">Back to Viewer</Link> */}
      {/* <div style={{ marginTop: "150px", textAlign: "center" }}>
        <IndeterminateProgressBar isLoading={true} />
      </div> */}
    </div>
  );
}
