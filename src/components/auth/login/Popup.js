import { useState, useEffect } from "react";
import styles from "./popup.module.css";

export default function Popup({ onChoice, onCancel, option1, option2 }) {
  const [closing, setClosing] = useState(false);

  const handleClose = (callback) => {
    setClosing(true);
    setTimeout(() => {
      callback();
    }, 10); // match CSS fadeOut duration
  };

  return (
    <div
      className={`${styles.overlay} ${closing ? styles.overlayClosing : ""}`}
    >
      <div className={`${styles.popup} ${closing ? styles.popupClosing : ""}`}>
        <h1>Your Summary is On The Way!</h1>
        <p>Please create your free account to get access. </p>
        <div className={styles.buttons}>
          <button
            className={styles.button}
            style={{
              background: "rgba(255, 255, 255, 0.95)",
              color: "rgba(31, 41, 55, 1)",
            }}
            onClick={() => handleClose(option1)}
          >
            Option 1
          </button>
          <button
            className={styles.button}
            style={{ background: "#2563eb", color: "white" }}
            onClick={() => handleClose(option2)}
          >
            Option 2
          </button>
        </div>
        <div className={styles.buttons}>
          <button
            className={styles.button}
            style={{ background: "#e5e7eb" }}
            onClick={handleClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
