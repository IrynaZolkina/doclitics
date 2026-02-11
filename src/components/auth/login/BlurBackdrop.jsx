"use client";

import { useEffect } from "react";
import styles from "./popupLogin.module.css";

export default function BlurBackdrop({ visible, onClick }) {
  useEffect(() => {
    if (!visible) return;

    document.body.classList.add("modal-open");

    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [visible]);

  return (
    <div
      className={`${styles.backdrop} ${visible ? styles.backdropOpen : ""}`}
      onClick={onClick}
    />
  );
}
