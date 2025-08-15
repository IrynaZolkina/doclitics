"use client";
import "../../../app/globals.css";
import styles from "../../css-modules/loginpage.module.css";

import { register } from "../../../actions/userservice";
import React, { useActionState } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { addToast } from "../../../redux/store";
import { useSearchParams } from "next/navigation";

const LoginPage = () => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("activated") === "1") {
      dispatch(
        addToast({
          id: Date.now(),
          message: "Your account has been activated!",
          type: "success",
        })
      );
    } else if (searchParams.get("error") === "invalid_token") {
      dispatch(
        addToast({
          id: Date.now(),
          message: "Invalid activation link.",
          type: "error",
        })
      );
    } else if (searchParams.get("error") === "expired_token") {
      dispatch(
        addToast({
          id: Date.now(),
          message: "Activation link expired.",
          type: "error",
        })
      );
    }
  }, [searchParams]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Login</h1>
      <form className={styles.form}>
        <input className={styles.input} placeholder="Email" />
        <input
          className={styles.input}
          placeholder="Password"
          type="password"
        />
        <button className={styles.button}>Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
