"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import styles from "./css-modules/ToastContainer.module.css";
import { removeToast } from "@/redux/store";

export default function ToastContainer() {
  const toasts = useSelector((state) => state.toast);
  const dispatch = useDispatch();

  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        dispatch(removeToast(toasts[0].id));
      }, 9000);
      return () => clearTimeout(timer);
    }
  }, [toasts, dispatch]);

  return (
    <div className={styles.toastWrapper}>
      {toasts.map((toast) => (
        <div key={toast.id} className={`${styles.toast} ${styles[toast.type]}`}>
          <span>{toast.message}</span>
          <button
            className={styles.closeBtn}
            onClick={() => dispatch(removeToast(toast.id))}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
