"use client";

import { useState, useEffect } from "react";
import styles from "./ToastSuper.module.css";

let showToastExternally;

export const toastManualFunction = (message, type = "info") => {
  if (showToastExternally) {
    showToastExternally({ message, type });
  }
};

const ToastManual = () => {
  const [popup, setPopup] = useState(null);
  const [show, setShow] = useState(false);

  // Expose setter for external calls
  useEffect(() => {
    showToastExternally = ({ message, type }) => {
      const newPopup = { message, type };
      setPopup(newPopup);
      setShow(false); // start hidden

      // wait one tick so CSS can apply initial hidden state
      setTimeout(() => setShow(true), 50); // triggers fade-in
    };
  }, []);

  if (!popup) return null;

  return (
    <div
      className={`${styles.popup} ${styles[popup.type]} ${
        show ? styles.show : ""
      }`}
    >
      {popup.message}
      <button
        className={styles.closeBtn}
        onClick={() => setShow(false)}
        aria-label="Close"
      >
        ✕
      </button>
    </div>
  );
};

export default ToastManual;
