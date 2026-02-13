"use client";
import { useEffect, useState } from "react";
import styles from "./Popup.module.css";

export default function Popup({ message, show, onClose }) {
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    if (!show) return;

    setVisible(true);

    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, 10000); // 10 seconds

    return () => clearTimeout(timer);
  }, [show, onClose]);

  if (!visible) return null;

  return (
    <div className={`${styles.popup} ${!visible ? styles.hide : ""}`}>
      {message}
    </div>
  );
}
