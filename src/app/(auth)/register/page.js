"use client";
import "../../../app/globals.css";
import styles from "../../css-modules/registerpage.module.css";

import React, { useActionState, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import InputSection from "@/components-ui/InputSection";
import { addToast } from "../../../redux/store";
import { useRouter } from "next/navigation";

const Register = () => {
  const [enteredUsername, setEnteredUsername] = useState("");
  const [enteredUsernameTouched, setEnteredUsernameTouched] = useState(false);
  const [enteredEmail, setEnteredEmail] = useState("");
  const [enteredEmailTouched, setEnteredEmailTouched] = useState(false);
  const [enteredPassword, setEnteredPassword] = useState("");
  const [enteredPasswordTouched, setEnteredPasswordTouched] = useState(false);
  const [enteredPasswordRepeat, setEnteredPasswordRepeat] = useState("");
  const [enteredPasswordRepeatTouched, setEnteredPasswordRepeadTouched] =
    useState(false);
  const [validationCheckEmail, setValidationCheckEmail] = useState(0);
  const [validationCheckUserName, setValidationCheckUserName] = useState(0);
  const [validationCheckPassword, setValidationCheckPassword] = useState(0);
  const [validationCheckPasswordRepeat, setValidationCheckPasswordRepeat] =
    useState(0);

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const [pending, setPending] = useState(true);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const channel = new BroadcastChannel("activation");
    channel.onmessage = (event) => {
      if (event.data?.activated) {
        setStatus("Activation success");
      }
    };
    return () => channel.close();
  }, []);

  // const email = formData.get("email");
  // const password = formData.get("password");
  // console.log("...state...", state);
  // console.log("...enteredUsername...", enteredUsername);
  // console.log("...password...", password);
  const validateUserName = (value) => /^[A-Za-z0-9_]+$/.test(value);
  const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const validatePassword = (value) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])(?!.*\s).{8,}$/.test(
      value
    );

  const validationEmail = (value) => {
    // console.log("...***********...");
    // console.log("...***********...", validateEmail(value));
    validateEmail(value)
      ? setValidationCheckEmail(1)
      : setValidationCheckEmail(2);
    value.length === 0 && setValidationCheckEmail(0);
    (validationCheckUserName === 1) &
      (validationCheckPassword === 1) &
      (validationCheckEmail === 1) &
      (validationCheckPasswordRepeat === 1) && setPending(true);
  };

  const validationUserName = (value) => {
    const length = value.length;
    validateUserName(value) &&
      ((length > 0) & (length < 3)
        ? setValidationCheckUserName(2)
        : (length >= 3) & (length <= 16)
        ? setValidationCheckUserName(1)
        : length === setValidationCheckUserName(0));
  };
  const validationPassword = (value) => {
    setValidationCheckPassword(1);

    // validatePassword(value)
    //   ? setValidationCheckPassword(1)
    //   : setValidationCheckPassword(2);
    value.length === 0 && setValidationCheckPassword(0);
  };

  const validationPasswordRepeat = (value) => {
    value === enteredPassword
      ? setValidationCheckPasswordRepeat(1)
      : setValidationCheckPasswordRepeat(2);
    value.length === 0 && setValidationCheckPasswordRepeat(0);
  };
  useEffect(() => {
    (validationCheckUserName === 1) &
      (validationCheckPassword === 1) &
      (validationCheckEmail === 1) &
      (validationCheckPasswordRepeat === 1) && setPending(false);
  }, [
    validationCheckUserName,
    validationCheckEmail,
    validationCheckPassword,
    validationCheckPasswordRepeat,
  ]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setPending(true);
    try {
      // ✅ API request
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: enteredUsername,
          email: enteredEmail,
          password: enteredPassword,
        }),
      });
      // if (!res.ok) throw new Error("Registration failed" + { ...data });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
        // setPending(false);
        // dispatch(

        //   addToast({
        //     id: Date.now(),
        //     type: res.ok ? "✅ success" : "❌error",
        //     message: res.data || "Something went wrong",
        //   })
        // );
        // throw new Error();
        // throw new Error("" || "Registration failed");
      }
      // const data = await res.json();
      // const mes = data.userDto.email;
      // dispatch(

      //   addToast({
      //     id: Date.now(),
      //     type: res.ok ? "✅ success" : "❌error",
      //     message: "" || "Something..... went wrong",
      //   })
      // );
      // console.log("Server response:", data);

      // const data = await res.json();
      // console.log("User registered:", { ...data });
      // console.log("mes-----:", mes);
      // dispatch(
      // );
      const result = await res.json();
      dispatch(
        addToast({
          type: "success",
          message: result.message || "Something..... went wrong",
        })
      );
      // dispatch(
      //   addToast({
      //     id: Date.now(),
      //     type: result.ok ? "success" : "error",
      //     message: result.message || "Something..... went wrong",
      //   })
      // );
      // dispatch(addToast({ type: "success", message: "User registered!" }));
    } catch (err) {
      dispatch(addToast({ type: "error", message: err.message }));
      // } catch (err) {
      //   console.log("err.message", err);

      // console.log("User registered:", { ...data });
      // const mes = data.userDto.email;
      // console.log("mes-----:", mes);
      // dispatch(
      //   addToast({
      //     id: Date.now(),
      //     type: "error",
      //     message: err.message || "Network error, please try again.",
      //   })
      // );
    } finally {
      setPending(false);
    }
  };

  const handleSubmitCode = async (e) => {
    e.preventDefault();
    if (!code || code.length !== 6) {
      dispatch(addToast({ type: "error", message: "Enter 6-digit code" }));
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, enteredEmail }),
      });

      const data = await res.json();

      if (!res.ok) {
        dispatch(addToast({ type: "error", message: data.error }));
        return;
      }

      dispatch(
        addToast({ type: "success", message: data.message || "Verificated" })
      );
      router.push("/login?registered=1");
    } catch (err) {
      // dispatch(addToast({ type: "error", message: err.message }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.registerWrapper}>
      <div className={styles.gridContainer}>
        <div className={styles.pictureContainer}></div>
        <div className={styles.registerContainer}>
          <div className={styles.twoButtons}>
            <span>Sign In</span>
            <span>Sign Up</span>
          </div>
          <h1>Create an account</h1>
          <p>Already have an account? Log in </p>
          <div className={styles.formBox}>
            {/* <form action={action}>
            <label htmlFor="email">Email</label>
            <input type="text" name="email" />
            <label htmlFor="password">password</label>
            <input type="text" name="password" /> */}
            {/* <label htmlFor="email">Email</label>
          <input type="text" name="email" /> */}
            <form onSubmit={handleSubmit} className={styles.form}>
              <>
                <InputSection
                  id={1}
                  name="enteredUsername"
                  enteredValue={enteredUsername}
                  setEnteredValue={setEnteredUsername}
                  labelText="What should we call you?"
                  touched={enteredUsernameTouched}
                  setTouched={setEnteredUsernameTouched}
                  inputType="text"
                  validation={validationUserName}
                  validationCheck={validationCheckUserName}
                  fieldLength={16}
                  correctMessage="Please, use letters, numbers, and underscore from 3 to 16 chars"
                  placeholder="Enter your profile name..."
                />
                <InputSection
                  id={2}
                  enteredValue={enteredEmail}
                  setEnteredValue={setEnteredEmail}
                  labelText="Your Email"
                  touched={enteredEmailTouched}
                  setTouched={setEnteredEmailTouched}
                  inputType="email"
                  validation={validationEmail}
                  validationCheck={validationCheckEmail}
                  fieldLength={50}
                  correctMessage="Please enter a valid email address"
                  placeholder="Enter your email address..."
                />
                <InputSection
                  id={3}
                  enteredValue={enteredPassword}
                  setEnteredValue={setEnteredPassword}
                  labelText="Your Password"
                  touched={enteredPasswordTouched}
                  setTouched={setEnteredPasswordTouched}
                  inputType="password"
                  validation={validationPassword}
                  validationCheck={validationCheckPassword}
                  fieldLength={50}
                  correctMessage="Please enter min 8 chars, at least 1 uppercase, 1 lowercase, 1 number, 1 symbol, no spaces"
                  placeholder="Enter your password..."
                />
                <InputSection
                  id={4}
                  enteredValue={enteredPasswordRepeat}
                  setEnteredValue={setEnteredPasswordRepeat}
                  labelText="Repeat Password"
                  touched={enteredPasswordRepeatTouched}
                  setTouched={setEnteredPasswordRepeadTouched}
                  inputType="password"
                  validation={validationPasswordRepeat}
                  validationCheck={validationCheckPasswordRepeat}
                  fieldLength={50}
                  correctMessage="Please enter min 8 chars, at least 1 uppercase, 1 lowercase, 1 number, 1 symbol, no spaces"
                  placeholder="Enter your password..."
                />
              </>
              <button
                type="submit"
                disabled={pending}
                className={styles.submitButton}
              >
                Submit...............
              </button>
            </form>
            <p>More...and more...</p>

            <input
              type="text"
              placeholder="6-digit code"
              value={code}
              maxLength={6}
              onChange={(e) => setCode(e.target.value)}
              required
              className={styles.form}
            />
            <div
              onClick={handleSubmitCode}
              type="submit"
              disabled={loading}
              className={styles.codeButton}
            >
              {loading ? "Submitting..." : "Register"}
            </div>

            {/* <button disabled={isPending}>
              {isPending ? "Loading..." : "Register"}
              </button> */}
            {/* </form> */}
          </div>
        </div>{" "}
      </div>
    </div>
  );
};

export default Register;
