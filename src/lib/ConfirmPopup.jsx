"use client";

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import styles from "./ConfirmPopup.module.css";

export default function ConfirmPopup({
  open,
  title = "Are you sure?",
  message = "Please confirm your action.",
  yesText = "Yes",
  noText = "No",
  onYes,
  onNo,
  disableBackdropClose = false,
}) {
  const [modalRoot, setModalRoot] = useState(null);

  useEffect(() => {
    // Runs only in browser
    setModalRoot(document.getElementById("modal-root"));
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.classList.add("modalOpen");
    return () => document.body.classList.remove("modalOpen");
  }, [open]);

  if (!open || !modalRoot) return null;

  const close = () => {
    if (disableBackdropClose) return;
    onNo?.();
  };

  return createPortal(
    <div
      className={styles.backdrop}
      onClick={close}
      role="dialog"
      aria-modal="true"
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.message}>{message}</p>

        <div className={styles.buttons}>
          <button className={styles.noBtn} type="button" onClick={onNo}>
            {noText}
          </button>
          <button className={styles.yesBtn} type="button" onClick={onYes}>
            {yesText}
          </button>
        </div>
      </div>
    </div>,
    modalRoot,
  );
}
