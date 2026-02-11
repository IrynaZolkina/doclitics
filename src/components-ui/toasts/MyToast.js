"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import styles from "./ToastContainer.module.css";
import { removeToast } from "@/redux/store";

export default function MyToast({ type, message, showToast, setShowToast }) {
  //   const toast = useSelector((state) => state.toast);
  //   const dispatch = useDispatch();
  console.log("toast---", type, message);
  useEffect(() => {
    if (!showToast) return;

    const timer = setTimeout(() => {
      setShowToast(false);
    }, 20000); // 20 seconds

    return () => clearTimeout(timer);
  }, [showToast, setShowToast]);

  return (
    <div
      className={styles.toastWrapper}
      style={{
        display: showToast ? "block" : "none",
        padding: "10px",
        background: "lightgreen",
        position: "fixed",
        top: "20px",
        right: "20px",
      }}
    >
      <div className={`${styles.toast} ${styles[type]}`}>
        <span>{message}</span>
        <button className={styles.closeBtn} onClick={() => setShowToast(false)}>
          ×
        </button>
      </div>
    </div>
  );
}
