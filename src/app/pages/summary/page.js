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

// import { Smile, Star, Fire } from "./icons";

export default function Summary() {
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
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
  // Detect Back/Forward navigation

  // Redirect to dashboard only if the page has finished loading and no choices
  // useEffect(() => {
  //   if (!isLoading && (!choices || choices.length === 0)) {
  //     router.replace("/pages/dashboard"); // 👈 skip back to dashboard
  //   }
  // }, [choices, isLoading, router]);

  //  Optionally clear summary after unmount
  // useEffect(() => {
  //   if (!isLoading) {
  //     return () => {
  //       dispatch(clearSummary());
  //     };
  //   }
  // }, [dispatch, isLoading]);

  // --- Example custom icons (can be your SVG components)
  // --- Replace these with your real SVG components
  // const Smile = (props) => (
  //   <span
  //     {...props}
  //     style={{ display: "inline-flex", verticalAlign: "middle" }}
  //   >
  //     😊
  //   </span>
  // );
  // const Star = (props) => (
  //   <span
  //     {...props}
  //     style={{ display: "inline-flex", verticalAlign: "middle" }}
  //   >
  //     ⭐
  //   </span>
  // );
  // const Fire = (props) => (
  //   <span
  //     {...props}
  //     style={{ display: "inline-flex", verticalAlign: "middle" }}
  //   >
  //     🔥
  //   </span>
  // );
  const markdownContent = `
# Hello 😃
This is a paragraph with ❤️ and 😎 emojis.

- List item 1   😃
- List item 2  😃
`;

  function replaceEmojis(children) {
    console.log("children:", children);
    if (typeof children === "string") {
      return children
        .split(/([\u{1F300}-\u{1FAFF}])/u)
        .map((part, i) =>
          emojiMap[part] ? (
            <span key={i}>{emojiMap[part]}</span>
          ) : (
            <span key={i}>{part}</span>
          )
        );
    }

    // If it's an array of children (React nodes)
    if (Array.isArray(children)) {
      return children.map((child, i) => {
        if (typeof child === "string") {
          return child
            .split(/([\u{1F300}-\u{1FAFF}])/u)
            .map((part, j) =>
              emojiMap[part] ? (
                <span key={`${i}-${j}`}>{emojiMap[part]}</span>
              ) : (
                <span key={`${i}-${j}`}>{part}</span>
              )
            );
        }
        return child;
      });
    }

    // Otherwise (single React element), just return it
    return children;
  }

  // const replacements = [<Smile />, <Star />, <Fire />];
  // Replace emojis in a string with React components (cycling)
  const markdownText = `
# Markdown Emoji Test

Hey 😄 Welcome to the app 😎 Enjoy 🚀 and smile 🔥 again!  
And again 😄🚀🔥 for good measure!
`;

  // Replace emojis in a single plain string with React components (cycled)
  const renderTextWithSVG = (text) => {
    if (typeof text !== "string") return text;

    const regex = emojiRegex();
    const parts = text.split(regex);
    const emojis = [...text.matchAll(regex)];
    const result = [];

    let emojiIndex = 0;
    for (let i = 0; i < parts.length; i++) {
      result.push(parts[i]);
      if (emojiIndex < emojis.length) {
        const Component = replacements[emojiIndex % replacements.length];
        result.push(
          React.cloneElement(Component, { key: `emoji-${emojiIndex}` })
        );
        emojiIndex++;
      }
    }
    return result;
  };

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

      <div className={styles.summaryContainer}>
        <div className="markdown">
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
