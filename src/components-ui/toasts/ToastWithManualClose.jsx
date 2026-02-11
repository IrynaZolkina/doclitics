import { useEffect, useState, useRef } from "react";

const VARIANT_STYLES = {
  success: { bg: "#2e7d32" },
  error: { bg: "#c62828" },
  warning: { bg: "#ed6c02" },
  info: { bg: "#1565c0" },
};

export default function ToastWithManualClose({
  message,
  show,
  variant = "info",
  duration = 3000,
  onClose,
}) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const toastRef = useRef(null);

  // Fade-in / fade-out logic
  useEffect(() => {
    if (!show) return;

    setMounted(true);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => setVisible(true));
    });

    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [show, duration]);

  // Close on outside click
  useEffect(() => {
    function handleOutsideClick(e) {
      if (toastRef.current && !toastRef.current.contains(e.target)) {
        handleClose();
      }
    }
    if (mounted) {
      document.addEventListener("mousedown", handleOutsideClick);
      return () =>
        document.removeEventListener("mousedown", handleOutsideClick);
    }
  }, [mounted]);

  function handleClose() {
    setVisible(false);
    setTimeout(() => {
      setMounted(false);
      onClose?.();
    }, 400); // match CSS transition
  }

  if (!mounted) return null;

  return (
    <>
      <div
        ref={toastRef}
        className={`toast ${visible ? "show" : ""}`}
        data-variant={variant}
      >
        <span className="message">{message}</span>
        <span className="close" onClick={handleClose}>
          ×
        </span>
      </div>

      <style jsx>{`
        .toast {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) scale(0.98);
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-width: 260px;
          max-width: 380px;
          padding: 16px 20px;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 500;
          color: #fff;
          opacity: 0;
          transform-origin: center;
          transition: opacity 0.4s ease, transform 0.4s ease;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
          z-index: 9999;
          cursor: default;
        }

        .toast.show {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1);
        }

        .toast[data-variant="success"] {
          background-color: ${VARIANT_STYLES.success.bg};
        }

        .toast[data-variant="error"] {
          background-color: ${VARIANT_STYLES.error.bg};
        }

        .toast[data-variant="warning"] {
          background-color: ${VARIANT_STYLES.warning.bg};
        }

        .toast[data-variant="info"] {
          background-color: ${VARIANT_STYLES.info.bg};
        }

        .message {
          flex: 1;
          text-align: center;
        }

        .close {
          margin-left: 12px;
          font-weight: bold;
          cursor: pointer;
          user-select: none;
        }

        .close:hover {
          opacity: 0.8;
        }
      `}</style>
    </>
  );
}
