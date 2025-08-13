"use client";
import "../../../app/globals.css";
import styles from "../../css-modules/registerpage.module.css";
import InputSection from "@/components-ui/InputSection";
import { register } from "../../../actions/userservice";
import React, { useActionState, useState } from "react";
import { RedXIcon } from "@/components-ui/svg-components/RedXIcon";
import { GreenCheckIcon } from "@/components-ui/svg-components/GreenCheckIcon";
import { GoogleIcon } from "@/components-ui/svg-components/GoogleIcon";

const Register = () => {
  const [state, action, isPending] = useActionState(register, undefined);
  const [enteredUsername, setEnteredUsername] = useState("");
  const [enteredUsernameTouched, setEnteredUsernameTouched] = useState(false);
  const [enteredEmail, setEnteredEmail] = useState("");
  const [enteredEmailTouched, setEnteredEmailTouched] = useState(false);
  const [enteredPassword, setEnteredPassword] = useState("");
  const [enteredPasswordTouched, setEnteredPasswordTouched] = useState(false);
  const [validationCheckEmail, setValidationCheckEmail] = useState(0);
  const [validationCheckUserName, setValidationCheckUserName] = useState(0);
  const [validationCheckPassword, setValidationCheckPassword] = useState(0);

  // const email = formData.get("email");
  // const password = formData.get("password");
  console.log("...state...", state);
  console.log("...enteredUsername...", enteredUsername);
  // console.log("...password...", password);
  const validateUserName = (value) => /^[a-zA-Z0-9_]*$/.test(value);
  const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const validatePassword = (value) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])(?!.*\s).{8,}$/.test(
      value
    );

  const validationEmail = (value) => {
    console.log("...***********...");
    console.log("...***********...", validateEmail(value));
    validateEmail(value)
      ? setValidationCheckEmail(1)
      : setValidationCheckEmail(2);
    value.length === 0 && setValidationCheckEmail(0);
  };
  const validationUserName = (value) => {
    const length = value.length;
    validateUserName(value) &&
      ((length > 0) & (length < 3)
        ? setValidationCheckUserName(2)
        : (length >= 3) & (length <= 12)
        ? setValidationCheckUserName(1)
        : length === setValidationCheckUserName(0));
  };
  const validationPassword = (value) => {
    console.log("...***********...");
    console.log("...***********...", validateEmail(value));
    validatePassword(value)
      ? setValidationCheckPassword(1)
      : setValidationCheckPassword(2);
    value.length === 0 && setValidationCheckPassword(0);
  };

  return (
    <div className={styles.registerWrapper}>
      <div className={styles.registerContainer}>
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
              fieldLength={12}
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
              className={styles.authorContainer}
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
          </>

          {/* <button disabled={isPending}>
              {isPending ? "Loading..." : "Register"}
            </button> */}
          {/* </form> */}
        </div>
      </div>{" "}
    </div>
  );
};

export default Register;
