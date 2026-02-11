import { useEffect, useState } from "react";

const VARIANT_STYLES = {
  success: {
    bg: "#2e7d32",
  },
  error: {
    bg: "#c62828",
  },
  warning: {
    bg: "#ed6c02",
  },
  info: {
    bg: "#1565c0",
  },
};

export default function ToastSuperComponent({
  message,
  show,
  variant = "info",
  onClose,
}) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!show) return;

    setMounted(true);

    // React 18 safe fade-in
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setVisible(true);
      });
    });

    const timer = setTimeout(() => {
      setVisible(false);

      setTimeout(() => {
        setMounted(false);
        onClose?.();
      }, 1500);
    }, 3000);

    return () => clearTimeout(timer);
  }, [show, onClose]);

  if (!mounted) return null;

  return (
    <>
      <div className={`toast ${visible ? "show" : ""}`} data-variant={variant}>
        {message}
      </div>

      <style jsx>{`
        .toast {
          position: fixed;
          /* bottom: 20px;
          right: 20px; */
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) scale(0.8);

          min-width: 260px;
          max-width: 360px;

          display: flex;
          align-items: center; /* vertical center */
          justify-content: center; /* horizontal center */
          text-align: center;

          padding: 16px 20px;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 500;

          color: #fff;
          background-color: #333;

          opacity: 0;
          /* transform: translateY(10px); */
          transition: opacity 0.4s ease, transform 0.4s ease;

          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
          z-index: 9999;
        }

        .toast.show {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1);
          /* transform: translateY(0); */
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
      `}</style>
    </>
  );
}
