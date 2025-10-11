"use client";
import styles from "../css-modules/summarypage.module.css";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import IndeterminateProgressBar from "@/components-ui/IndeterminateProgressBar";
import { clearSummary } from "@/redux/store";

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

  if (isLoading) {
    return (
      <div>
        <div style={{ marginTop: "150px", textAlign: "center" }}>
          <IndeterminateProgressBar isLoading={isLoading} />
        </div>
        <Link href="/pages/viewer">Back to Viewer</Link>
      </div>
    );
  }

  return (
    <div className={styles.summaryPage}>
      <h1>Your AI Summary</h1>
      {/* {choices.map((choice, index) => (
        <ReactMarkdown key={index}>{choice.message.content}</ReactMarkdown>
      ))} */}

      <div className={styles.summaryContainer}>
        {/* {choices.length > 0 &&
          choices.map((choice, index) => {
            const content = choice?.message?.content || "";
            return (
              // <div className="markdown">
              <div className="markdown" key={index}>
                <ReactMarkdown>{content}</ReactMarkdown>
              </div>
            );
          })} */}
        <div className="markdown">
          <ReactMarkdown>{choices}</ReactMarkdown>
        </div>
      </div>
      <Link href="/pages/viewer">Back to Viewer</Link>
      {/* <div style={{ marginTop: "150px", textAlign: "center" }}>
        <IndeterminateProgressBar isLoading={true} />
      </div> */}
    </div>
  );
}
