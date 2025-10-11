"use client";

import { useState, useEffect } from "react";
import styles from "./css-modules/popupLogin.module.css";
import { toastSuperFunction } from "@/components-ui/ToastSuper";
import { useDispatch } from "react-redux";
import { setLastPage, setUserLogin } from "@/redux/store";
import { GoogleIcon } from "@/components-ui/svg-components/GoogleIcon";
import InputSectionLogin from "@/components-ui/InputSectionLogin";
import Link from "next/link";
import Protect from "@/components-ui/svg-components/Protect";

let showLoginPopupExternal;

export const showLoginPopup = (callback) => {
  if (showLoginPopupExternal) showLoginPopupExternal(callback);
};

export default function PopupLoginInner({ setOpenPopupLogin }) {
  const [isOpen, setIsOpen] = useState(false);
  const [callbackOnSuccess, setCallbackOnSuccess] = useState(null);

  const [enteredEmail, setEnteredEmail] = useState("");

  const [enteredEmailTouched, setEnteredEmailTouched] = useState(false);
  const [enteredPassword, setEnteredPassword] = useState("");
  const [enteredPasswordTouched, setEnteredPasswordTouched] = useState(false);
  const [visiblePassword, setVisiblePassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [closing, setClosing] = useState(false);

  // useEffect(() => {
  //   // expose globally
  //   showLoginPopupExternal = (callback) => {
  //     setCallbackOnSuccess(() => callback);
  //     setIsOpen(true);
  //   };
  //   return () => {
  //     showLoginPopupExternal = null;
  //   };
  // }, []);
  const dispatch = useDispatch();

  // useEffect(() => {
  //   if (currentPath) {
  //     dispatch(setLastPage(currentPath));
  //   }
  // }, [currentPath, dispatch]);

  // if (!isOpen) return null;

  // const currentPath = window.location.pathname + window.location.search;

  // Save page before opening popup
  // dispatch(setLastPage(currentPath));

  const handleClose = () => {
    // setIsOpen(false);
    // setClosing(true);
    setClosing(true); // start fade-out animation
    setTimeout(() => {
      setIsOpen(false); // unmount popup
      setClosing(false); // reset for next open
      // callback?.(); // optional callback after close
    }, 300); // match your CSS animation duration
    setOpenPopupLogin(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: enteredEmail.toLowerCase(),
          password: enteredPassword,
        }),
      });
      const data = await res.json();
      console.log("Login response: ", data);

      if (!res.ok) {
        setError(data.error || "Login failed");
        toastSuperFunction(data.error, "error");
        setLoading(false);
        return;
      }

      // ✅ Login success
      dispatch(
        setUserLogin({
          username: data.userInfo.username,
          email: data.userInfo.email,
          userCategory: data.userInfo.category,
        })
      );
      // setIsOpen(false); // close popup immediately
      handleClose(); // no callback needed if you just want to close
      toastSuperFunction("✅ Logged in successfully!", "success");
      // close popup

      return;
      // Optional callback in parent
      // callbackOnSuccess?.(data); // trigger optional callback

      // Auto-close after fade-in toast duration (e.g., 2s)
      // setTimeout(handleClose, 2000);
    } catch (err) {
      setError("Network error. Please try again.");
    }
    // finally {
    //   setLoading(false);
    // }
  };

  const handleGoogleLogin = () => {
    // if (activeIndexType & activeIndexTone & value) {
    //   console.log(
    //     "------activeIndexType & activeIndexTone & value------",
    //     activeIndexType,
    //     activeIndexTone,
    //     value
    //   );
    //   localStorage.setItem(
    //     "myData",
    //     JSON.stringify({
    //       activeIndexType,
    //       activeIndexTone,
    //       value,
    //     })
    //   );
    // }
    // Save current page in a cookie
    document.cookie = `lastPage=${window.location.pathname}; path=/`;
    console.log("------document.cookie------", document.cookie);
    // Redirect to backend OAuth
    // Redirect to your backend route that sends user to Google
    window.location.href = "/api/auth/google";
    // const width = 500;
    // const height = 600;
    // const left = window.screenX + (window.innerWidth - width) / 2;
    // const top = window.screenY + (window.innerHeight - height) / 2;

    // const popup = window.open(
    //   "/api/auth/google",
    //   "GoogleLogin",
    //   `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes,status=yes`
    // );
    // // Listen for message from popup
    // window.addEventListener("message", function handler(event) {
    //   if (event.origin !== window.location.origin) return; // security
    //   const { type, userInfo } = event.data;
    //   if (type === "google-login-success") {
    //     console.log("User logged in:", userInfo);
    //     // update Redux or UI
    //     window.removeEventListener("message", handler);
    //   }
    // });
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

        <div className={styles.formBox}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <>
              <InputSectionLogin
                id={2}
                enteredValue={enteredEmail}
                setEnteredValue={setEnteredEmail}
                labelText="Your Email"
                touched={enteredEmailTouched}
                setTouched={setEnteredEmailTouched}
                inputType="email"
                fieldLength={50}
                correctMessage="Please enter a valid email address"
                placeholder="Enter your email address..."
              />{" "}
              <div className={styles.inputWrapper}>
                <div className={styles.passwordAndEye}>
                  <InputSectionLogin
                    id={3}
                    enteredValue={enteredPassword}
                    setEnteredValue={setEnteredPassword}
                    labelText="Your Password"
                    touched={enteredPasswordTouched}
                    setTouched={setEnteredPasswordTouched}
                    //inputType="password"
                    inputType={visiblePassword ? "text" : "password"}
                    fieldLength={50}
                    correctMessage="Please enter min 8 chars, at least 1 uppercase, 1 lowercase, 1 number, 1 symbol, no spaces"
                    placeholder="Enter your password..."
                  />
                  <button
                    type="button"
                    onClick={() => setVisiblePassword(!visiblePassword)}
                    className={styles.eyeButton}
                  >
                    {visiblePassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>
              <h5 className={styles.forgotPassword}>Forgot password?</h5>
              <button
                type="submit"
                // disabled={pending}
                className={styles.submitButton}
              >
                Login
              </button>
              <h6>
                <Protect />
                Your data is protected with enterprise-grade encryption
              </h6>
              <Link href={"/pages/auth/register"} onClick={() => handleClose()}>
                New to Doclitic? Create your free account
              </Link>
            </>
          </form>
        </div>
      </div>
    </div>
  );
}
