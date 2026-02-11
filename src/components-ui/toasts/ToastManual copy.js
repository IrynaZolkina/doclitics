import styles from "./css-modules/ToastManual.module.css";

const ToastManual = ({ message, type = "info", onClose }) => {
  if (!message) return null;

  return (
    <div className={`${styles.popup} ${styles[type]} ${styles.show}`}>
      {message}
      {onClose && (
        <button
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default ToastManual;
