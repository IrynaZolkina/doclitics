"use client";
import "../../../globals.css";
import styles from "../../css-modules/registerpage.module.css";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Image from "next/image";

import InputSection from "@/components-ui/InputSection";
import PopupEmailRegistered from "@/components/PopupEmailRegistered";
import PopupVerification from "@/components/PopupVerification";
import ToastSuper, { toastSuperFunction } from "@/components-ui/ToastSuper";
import ToastManual, { toastManualFunction } from "@/components-ui/ToastManual";

const Register = () => {
  const [userEmail, setUserEmail] = useState("");
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
  const [agree, setAgree] = useState(false);
  const [visiblePassword, setVisiblePassword] = useState(false);
  const [visiblePasswordRepeat, setVisiblePasswordRepeat] = useState(false);

  const [code, setCode] = useState("");
  const [verificationPopUp, setVerificationPopUp] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ type: "", message: "" });
  const [showToast, setShowToast] = useState(false);

  const [pending, setPending] = useState(true);

  const [popupToastSuper, setPopupToastSuper] = useState(null);
  const [showToastSuper, setShowToastSuper] = useState(false);

  const [showPopupEmailRegistered, setShowPopupEmailRegistered] = useState({
    status: false,
    message: "",
  });
  const [showPopupVerification, setShowPopupVerification] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  const validateUserName = (value) => /^[A-Za-z0-9_]+$/.test(value);
  // const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const validateEmail = (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) &&
    value.toLowerCase() !== "doclitic@gmail.com";

  const validatePassword = (value) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])(?!.*\s).{8,}$/.test(
      value
    );
  // const validateEmail = (value) => true;
  // const validatePassword = (value) => true;

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
      (validationCheckPasswordRepeat === 1) && //???????
      setPending(true);
  };

  const validationUserName = (value) => {
    const length = value.length;
    validateUserName(value) &&
      ((length > 0) & (length < 3)
        ? setValidationCheckUserName(2)
        : (length >= 3) & (length <= 16)
        ? setValidationCheckUserName(1)
        : setValidationCheckUserName(0)); ///// ???????
    // : length === setValidationCheckUserName(0)); ///// ???????
  };
  const validationPassword = (value) => {
    setValidationCheckPassword(1);

    validatePassword(value)
      ? setValidationCheckPassword(1)
      : setValidationCheckPassword(2);
    value.length === 0 && setValidationCheckPassword(0);
  };

  const validationPasswordRepeat = (value) => {
    value === enteredPassword
      ? setValidationCheckPasswordRepeat(1)
      : setValidationCheckPasswordRepeat(2);
    value.length === 0 && setValidationCheckPasswordRepeat(0);
  };
  useEffect(() => {
    setPending(true);
    (validationCheckUserName === 1) &
      (validationCheckPassword === 1) &
      (validationCheckEmail === 1) &
      (validationCheckPasswordRepeat === 1) &
      (validationCheckPassword === validationCheckPasswordRepeat) &
      agree && //??????
      setPending(false);
  }, [
    validationCheckUserName,
    validationCheckEmail,
    validationCheckPassword,
    validationCheckPasswordRepeat,
    agree,
  ]);

  async function handleRegister(e) {
    e.preventDefault();
    // console.log(
    //   "username: enteredUsername,email: enteredEmail.toLowerCase(),password: enteredPassword",
    //   enteredUsername,
    //   enteredEmail.toLowerCase(),
    //   enteredPassword
    // );
    setUserEmail(enteredEmail);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: enteredUsername,
          email: enteredEmail.toLowerCase(),
          password: enteredPassword,
        }),
      });

      const data = await res.json();

      // if (!res.ok) {
      //   throw new Error(data.error);
      // }
      if (!res.ok) {
        // Check error codes from server
        if (data.code === "EMAIL_EXISTS") {
          // setMessage("❌ This email is already registered.");
          setShowPopupEmailRegistered({
            status: true,
            message: "❌ This email is already registered.",
          });
        } else if (data.code === "EMAIL_PENDING") {
          setShowPopupEmailRegistered({
            status: true,
            message: "⚠️ This email is pending verification.",
          });
          // setMessage("⚠️ This email is pending verification. Please check your inbox.");
        } else {
          // setMessage("⚠️ Unexpected error. Please try again.");
          toastSuperFunction(
            "H⚠️ Unexpected error. Please try again.",
            "error"
          );
        }
        // setEnteredUsername("");
        // setEnteredUsernameTouched(false);
        setEnteredEmail("");
        setEnteredEmailTouched(false);
        setEnteredPassword("");
        setEnteredPasswordTouched(false);
        setEnteredPasswordRepeat("");
        setEnteredPasswordRepeadTouched(false);
        setValidationCheckEmail(0);
        // setValidationCheckUserName(0);
        setValidationCheckPassword(0);
        setValidationCheckPasswordRepeat(0);
        setAgree(false);
        return;
      }

      setShowPopupVerification(true);
      // // setEnteredUsername("");
      // // setEnteredUsernameTouched(false);
      // setEnteredEmail("");
      // setEnteredEmailTouched(false);
      // setEnteredPassword("");
      // setEnteredPasswordTouched(false);
      // setEnteredPasswordRepeat("");
      // setEnteredPasswordRepeadTouched(false);
      // setValidationCheckEmail(0);
      // // setValidationCheckUserName(0);
      // setValidationCheckPassword(0);
      // setValidationCheckPasswordRepeat(0);
      // setAgree(false);
    } catch (err) {
      // setShowPopupEmailRegistered({ status: true });
      console.log(err.message, err, "88****************");
    }

    // window.location.href = "/pages/auth/login";
  }

  return (
    <div className={styles.registerWrapper}>
      {showPopupEmailRegistered.status && (
        <PopupEmailRegistered
          // onChoice={(choice) => handleChoice(choice)}
          onCancel={() => setShowPopupEmailRegistered({ status: false })}
          // option1={() => router.push("/pages/register")}
          // option2={() => router.push("/pages/auth/login")}
          message={showPopupEmailRegistered.message}
          // option2={() => router.push("/pages/login")}
        />
      )}
      {showPopupVerification && (
        <PopupVerification
          // onChoice={(choice) => handleChoice(choice)}
          onCancel={() => {
            setShowPopupVerification(false);
            // router.push("/pages/auth/login");
          }}
          // option2={() => router.push("/pages/login")}
          email={userEmail}
          setVerificationCode={setVerificationCode}
          // handleVerify={handleVerify}
          onSuccess={() => {
            setShowPopupVerification(false); // close popup
            router.push("/pages/auth/login"); // go to login
          }}
          onFailure={() => {
            setShowPopupVerification(false);
            // router.push("/pages/auth/register"); // 👈 back to register
          }}
          // option1={() => router.push("/pages/register")}
          //option2={() => router.push("/pages/login")}
          // option2={() => router.push("/pages/login")}
        />
      )}
      <div className={styles.gridContainer}>
        <div className={styles.pictureContainer}>
          <div>
            <Image
              src="/register.png"
              alt="Picture"
              width={554}
              height={775}
              className={styles.image}
            />
            <div className={styles.imageText}>
              <div className={styles.imageTextInner}>
                <h1>Transform Your</h1>
                <h1>
                  <span>Documents</span> with AI
                </h1>
                <h3 className={styles.h3}>
                  Experience the future of document processing
                </h3>
                <p className={styles.h3}>
                  with Doclitic intelligent AI companion.
                </p>
                <div className={styles.textBlock}>
                  <div className={styles.head}>
                    <span className={styles.circle}></span>{" "}
                    <p>Instant document analysis and insights</p>
                  </div>
                  <div className={styles.head}>
                    <span className={styles.circle}></span>{" "}
                    <p>Natural language document interaction</p>
                  </div>
                  <div className={styles.head}>
                    <span className={styles.circle}></span>
                    <p>Enterprise-grade security and privacy</p>
                  </div>
                </div>
              </div>
              <div className={styles.boxes}>
                <div>
                  <h2>10K+</h2>
                  <p>Documents Processed</p>
                </div>
                <div>
                  <h2>99.9%</h2>
                  <p>Accuracy Rate</p>
                </div>
              </div>
            </div>
          </div>{" "}
          {/* <div className={styles.overlay}> </div> */}
        </div>
        <div className={styles.registerContainer}>
          <h1>Join Doclitic</h1>
          <p>Transform how you work with documents forever. </p>

          <div className={styles.formBox}>
            <form onSubmit={handleRegister} className={styles.form}>
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
                />{" "}
                <div className={styles.inputWrapper}>
                  <InputSection
                    id={3}
                    enteredValue={enteredPassword}
                    setEnteredValue={setEnteredPassword}
                    labelText="Your Password"
                    touched={enteredPasswordTouched}
                    setTouched={setEnteredPasswordTouched}
                    //inputType="password"
                    inputType={visiblePassword ? "text" : "password"}
                    validation={validationPassword}
                    validationCheck={validationCheckPassword}
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
                </div>{" "}
                <div className={styles.inputWrapper}>
                  <InputSection
                    id={4}
                    enteredValue={enteredPasswordRepeat}
                    setEnteredValue={setEnteredPasswordRepeat}
                    labelText="Repeat Password"
                    touched={enteredPasswordRepeatTouched}
                    setTouched={setEnteredPasswordRepeadTouched}
                    //inputType="password"
                    inputType={visiblePasswordRepeat ? "text" : "password"}
                    validation={validationPasswordRepeat}
                    validationCheck={validationCheckPasswordRepeat}
                    fieldLength={50}
                    correctMessage="Please repeat the password"
                    placeholder="Enter your password..."
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setVisiblePasswordRepeat(!visiblePasswordRepeat)
                    }
                    className={styles.eyeButton}
                  >
                    {visiblePasswordRepeat ? "🙈" : "👁️"}
                  </button>
                </div>
                <div>
                  <label className={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={agree}
                      onChange={(e) => setAgree(e.target.checked)}
                    />{" "}
                    <span className={styles.checkmark}></span>{" "}
                    <div>
                      I agree to the{" "}
                      <span className={styles.checkm}>Terms of Service</span>{" "}
                      and <span className={styles.checkm}>Privacy Policy</span>
                    </div>
                  </label>{" "}
                </div>
                <button
                  type="submit"
                  disabled={pending}
                  className={styles.submitButton}
                >
                  Create Your Free Account
                </button>
              </>
            </form>
            {/* {verificationPopUp && (
              <div>
                <input
                  type="text"
                  placeholder="6-digit code"
                  value={verificationCode}
                  maxLength={6}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  required
                  className={styles.form}
                />
                <div
                  onClick={handleVerify}
                  type="submit"
                  disabled={loading}
                  className={styles.codeButton}
                >
                  {loading ? "Submitting..." : "Register"}
                </div>
              </div>
            )} */}
            {/* <button
              onClick={() => {
                toastManualFunction("Hello world!", "success");
              }}
            >
              {"Register"}
            </button>
            <button
              onClick={() => {
                toastSuperFunction("Hello world!", "error");
              }}
            >
              {"Register"}
            </button> */}

            {/* </form> */}
          </div>
        </div>{" "}
      </div>

      {/* <MyToast
        type={toast.type}
        message={toast.message}
        showToast={showToast}
        setShowToast={setShowToast}
      /> */}
    </div>
  );
};

export default Register;
