import { useState, useEffect } from "react";
import styles from "./css-modules/popupLogin.module.css";
import { toastSuperFunction } from "@/components-ui/ToastSuper";
import { useDispatch } from "react-redux";
import { setUserLogin } from "@/redux/store";
import { GoogleIcon } from "@/components-ui/svg-components/GoogleIcon";

let showLoginPopupExternal;

export const showLoginPopup = (callback) => {
  if (showLoginPopupExternal) showLoginPopupExternal(callback);
};

export default function PopupLogin() {
  const [isOpen, setIsOpen] = useState(false);
  const [callbackOnSuccess, setCallbackOnSuccess] = useState(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [closing, setClosing] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    // expose globally
    showLoginPopupExternal = (callback) => {
      setCallbackOnSuccess(() => callback);
      setIsOpen(true);
    };
    return () => {
      showLoginPopupExternal = null;
    };
  }, []);

  if (!isOpen) return null;

  const handleClose = () => {
    setIsOpen(false);
    setClosing(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      // ✅ Login success
      toastSuperFunction("✅ Logged in successfully!", "success");
      dispatch(
        setUserLogin({
          username: data.user.username,
          email: data.user.email,
          userCategory: data.user.category,
        })
      );
      // Optional callback in parent
      callbackOnSuccess?.(data); // trigger optional callback

      // Auto-close after fade-in toast duration (e.g., 2s)
      setTimeout(handleClose, 2000);
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Redirect to your backend route that sends user to Google
    window.location.href = "/api/auth/google";
  };

  return (
    <div
      className={`${styles.overlay} ${closing ? styles.overlayClosing : ""}`}
    >
      <div className={`${styles.popup} ${closing ? styles.popupClosing : ""}`}>
        <button className={styles.closeBtn} onClick={handleClose}>
          ✕
        </button>
        <h1>Your Summary is On The Way!</h1>
        <p>Please Sign In or create a free account</p>
        <button onClick={handleGoogleLogin} className={styles.googleButton}>
          <GoogleIcon /> Continue with Google
        </button>
        <div className={styles.continueTextBlock}>
          <span></span>
          <div className={styles.continueText}>or continue with email</div>
          <span></span>
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.inputField}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.inputField}
          />
          <button className={styles.button} type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
