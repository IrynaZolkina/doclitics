"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeToast } from "../redux/store";
import styles from "./css-modules/ToastContainer.module.css";

export default function ToastContainer() {
  const toasts = useSelector((state) => state.toast);
  const dispatch = useDispatch();

  useEffect(() => {
    const timers = toasts.map((toast) =>
      setTimeout(() => dispatch(removeToast(toast.id)), 3000)
    );

    // Cleanup timers if component unmounts or toasts change
    return () => timers.forEach((t) => clearTimeout(t));
  }, [toasts, dispatch]);

  return (
    <div className={styles.toastWrapper}>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${styles.toast} ${
            toast.type === "success"
              ? styles.success
              : toast.type === "error"
              ? styles.error
              : styles.info
          } ${styles.fadeIn}`}
        >
          <span>{toast.message}</span>
          <button
            className={styles.closeBtn}
            onClick={() => dispatch(removeToast(toast.id))}
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
}
