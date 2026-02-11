"use client";

import Popup from "./Popup";
import { useEffect, useState } from "react";
import styles from "./Popup.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import IndeterminateProgressBar from "@/components-ui/z-others/IndeterminateProgressBar";
import { clearSummary } from "@/redux/store";

export default function Test() {
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const choices = useSelector((state) => state.summary.choices);

  // Clear summary once when component mounts
  useEffect(() => {
    dispatch(clearSummary());
  }, [dispatch]);

  // Update loading state whenever choices change
  useEffect(() => {
    if (!choices || choices.length === 0) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [choices]);

  if (!choices || choices.length === 0) {
    return (
      <div>
        <p style={{ marginTop: "150px", textAlign: "center" }}>
          <IndeterminateProgressBar isLoading={isLoading} />
        </p>
        <Link href="/pages/viewer">Back to Viewer</Link>
      </div>
    );
  }

  return (
    <div className={styles.summaryPage}>
      <h1>Your AI Summary</h1>
      {choices.map((choice, index) => (
        <ReactMarkdown key={index}>{choice.message.content}</ReactMarkdown>
      ))}
      <Link href="/pages/viewer">Back to Viewer</Link>
    </div>
  );
}
