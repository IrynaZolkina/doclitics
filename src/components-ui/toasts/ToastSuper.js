"use client";
// ToastSuperSingleton.js
import { useState, useEffect } from "react";
import styles from "./ToastSuper.module.css";

let showToastExternal;

export const toastSuperFunction = (message, type = "info") => {
  if (showToastExternal) {
    showToastExternal({ message, type });
  }
};

const ToastSuper = () => {
  const [popup, setPopup] = useState(null);
  const [visible, setVisible] = useState(false);

  // Expose function to global
  useEffect(() => {
    showToastExternal = ({ message, type }) => {
      setPopup({ message, type });
      setVisible(false);
      setTimeout(() => setVisible(true), 50); // fade-in
      setTimeout(() => setVisible(false), 5000); // fade-out
      setTimeout(() => setPopup(null), 5500); // remove
    };
    return () => {
      showToastExternal = null;
    };
  }, []);

  if (!popup) return null;

  return (
    <div
      className={`${styles.popup} ${styles[popup.type]} ${
        visible ? styles.show : ""
      }`}
    >
      {popup.message}
      <button
        className={styles.closeBtn}
        onClick={() => setPopup(null)}
        aria-label="Close"
      >
        ✕
      </button>
    </div>
  );
};

export default ToastSuper;
