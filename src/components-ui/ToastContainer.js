"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import styles from "./css-modules/ToastContainer.module.css";
import { removeToast } from "@/redux/store";

export default function ToastContainer() {
  const toast = useSelector((state) => state.toast);
  const dispatch = useDispatch();
  console.log("toast---", toast);

  // useEffect(() => {
  // if (toasts.length > 0) {
  //   const timer = setTimeout(() => {
  //     dispatch(removeToast(toasts[0].id));
  //   }, 9000);
  //   return () => clearTimeout(timer);
  // }
  //   const timers = toasts.map((toast) =>
  //     setTimeout(() => dispatch(removeToast(toast.id)), 90000)
  //   );

  //   return () => timers.forEach((t) => clearTimeout(t));
  // }, [toasts, dispatch]);

  //   useEffect(() => {
  //     // For each toast, set a timer only if it hasn't been handled yet
  //     const timers = toasts.map((toast) =>
  //       setTimeout(() => {
  //         dispatch(removeToast(toast.id));
  //       }, 90000)
  //     );

  //     // Cleanup on unmount or toasts change
  //     return () => timers.forEach((t) => clearTimeout(t));
  //   }, [toasts, dispatch]);

  //   return (
  //     <div className={styles.toastWrapper}>
  //       {toasts.map((toast) => (
  //         <div key={toast.id} className={`${styles.toast} ${styles[toast.type]}`}>
  //           <span>{toast.message}</span>
  //           <button
  //             className={styles.closeBtn}
  //             onClick={() => dispatch(removeToast(toast.id))}
  //           >
  //             ×
  //           </button>
  //         </div>
  //       ))}
  //     </div>
  //   );
  // }
  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => dispatch(removeToast()), 90000);

    return () => clearTimeout(timer);
  }, [dispatch, toast]);

  if (!toast) return null;

  return (
    <div className={styles.toastWrapper}>
      <div className={`${styles.toast} ${styles[toast.type]}`}>
        <span>{toast.message}</span>
        <button
          className={styles.closeBtn}
          onClick={() => dispatch(removeToast())}
        >
          ×
        </button>
      </div>
    </div>
  );
}
