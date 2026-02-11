"use client";

import styles from "./popupLogin.module.css";

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/store";
import { GoogleIcon } from "@/components-ui/svg-components/GoogleIcon";
import InputSectionLogin from "@/components-ui/inputs/InputSectionLogin";
import Link from "next/link";
import Protect from "@/components-ui/svg-components/Protect";

import { toastSuperFunction } from "@/components-ui/toasts/ToastSuper";
import { toastManualFunctionJS } from "@/components-ui/toasts/toastManualFunctionJS";
import ToastWithManualClose from "@/components-ui/toasts/ToastWithManualClose";
import { toastSuperFunctionJS } from "@/components-ui/toasts/toastSuperFunctionJS";
// import Portal from "./Portal";

export default function PopupLogin({ onClose, error }) {
  const [enteredEmail, setEnteredEmail] = useState("");

  const [enteredEmailTouched, setEnteredEmailTouched] = useState(false);
  const [enteredPassword, setEnteredPassword] = useState("");
  const [enteredPasswordTouched, setEnteredPasswordTouched] = useState(false);
  const [visiblePassword, setVisiblePassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  // const [mounted, setMounted] = useState(false);

  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const [localError, setLocalError] = useState("");

  console.log("LOGINPOPUP");

  useEffect(() => {
    // Only after mount
    // setMounted(true);
    requestAnimationFrame(() => setVisible(true));

    // Body scroll lock
    const scrollY = window.scrollY;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    document.body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.paddingRight = "";
      window.scrollTo(0, scrollY);
    };
  }, []);

  useEffect(() => {
    // Trigger fade-in when mounted
    setOpen(true);
    const timer = setTimeout(() => {}, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (error === "email") {
      setLocalError("Please verify your email before logging in.");
    }
  }, [error]);

  // useEffect(() => {
  //   showLoginPopupExternal = (callback) => {
  //     setCallbackOnSuccess(() => callback);
  //     setIsOpen(true);
  //   };
  //   return () => {
  //     showLoginPopupExternal = null;
  //   };
  // }, []);

  // if (!isOpen) return null;

  // const currentPath = window.location.pathname + window.location.search;

  // Save page before opening popup
  // dispatch(setLastPage(currentPath));

  // const handleClose = () => {
  //   setClosing(true); // start fade-out animation
  //   // setOpen(false); // remove open styles
  //   setTimeout(() => {
  //     onClose?.(); // parent unmounts popup after animation
  //   }, 300); // match CSS
  // };
  // const handleClose = () => {
  //   setClosing(true); // triggers CSS fade-out
  //   setVisible(false); // optional, in case you want instant reset

  //   setTimeout(() => {
  //     onClose?.(); // unmount after transition
  //   }, 250); // match CSS duration
  // };
  const handleClose = () => {
    setClosing(true);
    setVisible(false);
    setTimeout(() => onClose?.(), 250); // match CSS duration
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLocalError("");

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
        // setLocalError(data.error || "Login failed");
        toastSuperFunctionJS(data.error, "error");

        return;
      }

      // ✅ Login success
      dispatch(
        setUser({
          id: data.userInfo._id,
          username: data.userInfo.username,
          email: data.userInfo.email,
          plan: data.userInfo.plan ?? null,
          role: data.userInfo.role ?? null,
          picture: data.userInfo.picture ?? null,
        }),
      );

      toastSuperFunction("✅ Logged in successfully!", "success");
      handleClose(); // no callback needed if you just want to close
    } catch (err) {
      setLocalError("Network error. Please try again.");
    } finally {
      setLoading(false);
      // window.location.href = "/";
    }
  };

  const handleGoogleLogin = () => {
    // Redirect to your backend route that sends user to Google
    window.location.href = "/api/auth/google";
  };
  // if (!mounted) return null; // <--- wait for client
  return (
    <>
      {/* BLUR + CLICK CATCHER (ONE LAYER ONLY) */}
      {/* <div
        className={`${styles.backdrop} ${open ? styles.backdropOpen : ""}`}
        onClick={handleClose}
      /> */}
      <div
        className={`${styles.backdrop} ${visible ? styles.backdropOpen : ""}`}
        onClick={handleClose}
      />
      {/* <div
        className={`${styles.overlay} ${open ? styles.overlayOpen : ""}`}
        onClick={handleClose}
      > */}
      {/* <div className={styles.blurLayer}></div> */}
      {/* POPUP */}
      <div
        // className={`${styles.popup} ${open ? styles.popupOpen : ""} ${
        //   closing ? styles.popupClosing : ""
        // }`}
        // className={`${styles.popup} ${visible ? styles.visible : ""} ${
        //   closing ? styles.closing : ""
        // }`}
        className={`${styles.popup} ${visible ? styles.visible : ""} ${
          closing ? styles.closing : ""
        }`}
        onClick={(e) => e.stopPropagation()}
      >
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
        {/* {localError && <p className={styles.error}>{localError}</p>} */}

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
              />
              <div className={styles.inputWrapper}>
                <div className={styles.passwordAndEye}>
                  <InputSectionLogin
                    id={3}
                    enteredValue={enteredPassword}
                    setEnteredValue={setEnteredPassword}
                    labelText="Your Password"
                    touched={enteredPasswordTouched}
                    setTouched={setEnteredPasswordTouched}
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
              <Link href={"/pages/auth/register"}>
                {/* onClick={() => handleClose()}> */}
                New to Doclitic? Create your free account
              </Link>
            </>
          </form>
        </div>
      </div>
      {/* </div> */}
    </>
  );
}
