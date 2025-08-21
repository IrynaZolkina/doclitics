// /components-ui/ClientToastHandler.js
"use client";

import { useSelector, useDispatch } from "react-redux";
import { removeToast } from "../redux/store";
import styles from "../css-modules/toast.module.css"; // optional: your toast CSS

export default function ClientToastHandler() {
  const dispatch = useDispatch();
  const toasts = useSelector((state) => state.toast);

  const handleRemove = (id) => {
    dispatch(removeToast(id));
  };

  return (
    <div className={styles.toastContainer}>
      {toasts.map((toast) => (
        <div key={toast.id} className={`${styles.toast} ${styles[toast.type]}`}>
          <span>{toast.message}</span>
          <button
            className={styles.closeButton}
            onClick={() => handleRemove(toast.id)}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
