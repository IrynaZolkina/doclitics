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
import { toastSuperFunctionJS } from "@/components-ui/toasts/toastSuperFunctionJS";

export default function PopupLogin({ onClose, error }) {
  const [enteredEmail, setEnteredEmail] = useState("");
  const [enteredEmailTouched, setEnteredEmailTouched] = useState(false);
  const [enteredPassword, setEnteredPassword] = useState("");
  const [enteredPasswordTouched, setEnteredPasswordTouched] = useState(false);
  const [visiblePassword, setVisiblePassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [visible, setVisible] = useState(false); // fade-in/fade-out
  const [closing, setClosing] = useState(false); // for fade-out animation

  const dispatch = useDispatch();
  const [localError, setLocalError] = useState("");
  console.log("LOGINPOPUP");
  // Fade-in after mount
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  // Body scroll lock
  useEffect(() => {
    // const scrollY = window.scrollY;
    // const scrollbarWidth =
    //   window.innerWidth - document.documentElement.clientWidth;

    // document.body.style.position = "fixed";
    // document.body.style.top = `-${scrollY}px`;
    // document.body.style.width = "100%";
    // document.body.style.paddingRight = `${scrollbarWidth}px`;

    requestAnimationFrame(() => setVisible(true));

    // return () => {
    //   document.body.style.position = "";
    //   document.body.style.top = "";
    //   document.body.style.width = "";
    //   document.body.style.paddingRight = "";
    //   window.scrollTo(0, scrollY);
    // };
  }, []);
  useEffect(() => {
    const wrapper = document.querySelector(".page-wrapper");
    if (visible) wrapper?.classList.add("blurred");
    else wrapper?.classList.remove("blurred");

    return () => wrapper?.classList.remove("blurred");
  }, [visible]);
  // Set error from props
  useEffect(() => {
    if (error === "email") {
      setLocalError("Please verify your email before logging in.");
    }
  }, [error]);

  const handleClose = () => {
    // setClosing(true);
    setVisible(false);
    setTimeout(() => onClose?.(), 250); // match CSS transition
  };
  const close = () => {
    setClosing(true);
    setVisible(false);

    setTimeout(onClose, 250); // must match CSS
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

      if (!res.ok) {
        console.log("LOGIN ERROR:", data.error);
        toastSuperFunctionJS(data.error, "error");
        return;
      }

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
      handleClose();
    } catch {
      setLocalError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "/api/auth/google";
  };

  return (
    <>
      {/* BACKDROP */}
      <div
        className={`${styles.backdrop} ${visible ? styles.backdropOpen : ""}`}
        onClick={close}
      />

      {/* POPUP */}
      <div
        className={`${styles.popup} ${
          visible ? styles.visible : ""
        } ${closing ? styles.closing : ""}`}
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

        {localError && <p className={styles.error}>{localError}</p>}

        <div className={styles.formBox}>
          <form onSubmit={handleSubmit} className={styles.form}>
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
              className={styles.submitButton}
              disabled={loading}
            >
              Login
            </button>

            <h6>
              <Protect />
              Your data is protected with enterprise-grade encryption
            </h6>

            <Link href={"/auth/register"}>
              New to Doclitic? Create your free account
            </Link>
          </form>
        </div>
      </div>
    </>
  );
}
