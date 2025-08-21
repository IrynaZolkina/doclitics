"use client";

import "../../globals.css";
import styles from "../../css-modules/loginpage.module.css";
// import { Suspense } from "react";

// import { register } from "../../../actions/userservice";

// import ClientToastHandler from "@/components-ui/ClientToastHandler";
import { useDispatch } from "react-redux";

import InputSectionLogin from "@/components-ui/InputSectionLogin";

import { useState } from "react";
import { addToast } from "@/redux/store";

const LoginPage = () => {
  const [enteredEmail, setEnteredEmail] = useState("");
  const [enteredEmailTouched, setEnteredEmailTouched] = useState(false);
  const [enteredPassword, setEnteredPassword] = useState("");
  const [enteredPasswordTouched, setEnteredPasswordTouched] = useState(false);
  const [pending, setPending] = useState(true);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPending(true);
    try {
      // ✅ API request
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: enteredEmail,
          password: enteredPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        console.log("User :", data.error);
        throw new Error(data.error);

        // const mes = data.userDto.email;
        // console.log("mes-----:", mes);
        // dispatch(
        //   addToast({
        //     id: Date.now(),
        //     type: res.ok ? "success" : "error",
        //     message: data.message + mes || "Something went wrong",
        //   })
        // );
      }
      // const result = await res.json();

      const mes = data.userDto.email;
      console.log("mes-----:", mes);
      console.log("usrname-----:", data.userDto.username);
      console.log("mes-----:", mes);
      dispatch(
        addToast({
          type: "success",
          message: data.message || "Something..... went wrong",
        })
      );
    } catch (err) {
      // console.log("err.message", err.message);
      dispatch(addToast({ type: "error", message: err.message }));
      // dispatch(
      //   addToast({
      //     id: Date.now(),
      //     type: "error",
      //     message: "Network... error, please try again.",
      //   })
      // );
    } finally {
      setPending(false);
    }
  };

  const logout = async () => {};

  return (
    <div className={styles.container}>
      {/* <Suspense fallback={null}> */}
      {/* <ClientToastHandler /> */}
      {/* </Suspense> */}
      <h1 className={styles.title}>Login</h1>
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
          placeholder="Enter your email address..."
        />
        <InputSectionLogin
          id={3}
          enteredValue={enteredPassword}
          setEnteredValue={setEnteredPassword}
          labelText="Your Password"
          touched={enteredPasswordTouched}
          setTouched={setEnteredPasswordTouched}
          inputType="password"
          fieldLength={50}
          placeholder="Enter your password..."
        />
        <button className={styles.button}>Login</button>
      </form>
      <button onClick={logout} className={styles.button}>
        LogOUT
      </button>
    </div>
  );
};

export default LoginPage;
