"use client";

import "@/app/globals.css";
import styles from "../../css-modules/loginpage.module.css";
// import { Suspense } from "react";

// import { register } from "../../../actions/userservice";

// import ClientToastHandler from "@/components-ui/ClientToastHandler";
import { useDispatch } from "react-redux";

import InputSectionLogin from "@/components-ui/InputSectionLogin";

import { useEffect, useState } from "react";
import { addToast, setUserLogin } from "@/redux/store"; //kkkkkkk
import { GoogleIcon } from "@/components-ui/svg-components/GoogleIcon";

const LoginPage = () => {
  const [enteredEmail, setEnteredEmail] = useState("");
  const [enteredEmailTouched, setEnteredEmailTouched] = useState(false);
  const [enteredPassword, setEnteredPassword] = useState("");
  const [enteredPasswordTouched, setEnteredPasswordTouched] = useState(false);
  const [pending, setPending] = useState(true);
  const dispatch = useDispatch();

  // useEffect(() => {
  //   async function fetchUser() {
  //     try {
  //       const res = await fetch("/api/auth/me", {
  //         method: "GET",
  //         credentials: "include", // important for cookies
  //       });
  //       if (!res.ok) return;

  //       const data = await res.json();
  //       dispatch(
  //         setUserLogin({
  //           username: data.user.username,
  //           picture: data.user.picture,
  //         })
  //       );
  //     } catch (err) {
  //       console.error("Failed to fetch user:", err);
  //     }
  //   }

  //   fetchUser();
  // }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPending(true);
    try {
      // ✅ API request
      console.log("handleSubmit ********", enteredEmail, enteredPassword);
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: enteredEmail,
          password: enteredPassword,
        }),
      });

      const data = await res.json();
      // console.log("res from login api:::::::::::::::::::::::;", res);
      console.log("data from login api:::::::::::::::::::::::;", data);
      if (!res.ok) {
        console.log("User :", data.error);
        throw new Error(data.error);
      }
      // dispatch(
      //   addToast({
      //     type: "success",
      //     message: data.message || "Something..... went wrong",
      //   })
      // );
      dispatch(
        setUserLogin({
          username: data.user.username,
          email: data.user.email,
          picture: data.user.picture,
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
    }
    // finally {
    //   setPending(false);
    // }
  };

  const logout = async () => {};

  const handleGoogleLogin = () => {
    // Redirect to your backend route that sends user to Google
    window.location.href = "/api/auth/google";
  };

  return (
    <div className={styles.container}>
      {/* <Suspense fallback={null}> */}
      {/* <ClientToastHandler /> */}
      {/* </Suspense> */}
      <button onClick={handleGoogleLogin} className={styles.googleButton}>
        <GoogleIcon /> Login with Google
      </button>
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
