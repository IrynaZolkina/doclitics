import { useState, useEffect } from "react";
import styles from "./css-modules/popupverification.module.css";
import Mail from "@/components-ui/svg-components/Mail";
import { maskEmail } from "@/utils/emailfunctions";
import VerificationCodeInput from "./VerificationCodeInput";
import CountdownTimer from "@/components-ui/CountdownTimer";
import { toastManualFunction } from "@/components-ui/ToastManual";

export default function PopupVerification({
  onChoice,
  onCancel,
  onSuccess,
  onFailure,
  option1,
  option2,
  email,
  setVerificationCode,
}) {
  const [code, setCode] = useState("");
  const [success, setSuccess] = useState(false);
  const [closing, setClosing] = useState(false);
  const handleClose = (callback) => {
    setClosing(true);
    setTimeout(() => {
      if (callback) {
        callback();
      }
    }, 2000); // match CSS fadeOut duration
  };

  const handleSubmit = (fullCode, success) => {
    setCode(fullCode);
    setVerificationCode(fullCode);

    // Close popup in both cases, but routing depends on success/failure
    handleClose(() => {
      onCancel();
      if (success) {
        router.push("/pages/login");
      } else {
        router.push("/pages/register");
      }
    });
    // if (success) {
    //   // close only if verification passed
    //   handleClose(onSuccess);
    // }

    // // handleClose(option2);
    // console.log("Submitted code:", fullCode);
    // // handleVerify(fullCode, enteredEmail);
  };

  const handleTimerEnd = () => {
    toastManualFunction("⏳ Code expired. Try registration again.", "error");
    handleClose(onFailure); // 👈 close and redirect to register
  };

  const handleTooManyAttempts = () => {
    toastManualFunction(
      "🚫 Too many attempts. Try registration again.",
      "error"
    );
    handleClose(onFailure); // 👈 close and redirect to register
  };

  return (
    <div
      className={`${styles.overlay} ${closing ? styles.overlayClosing : ""}`}
    >
      <div className={`${styles.popup} ${closing ? styles.popupClosing : ""}`}>
        <div className={styles.mailSvg}>
          <Mail />
        </div>
        <h1>Verify Your Email</h1>
        <p>Enter the code we sent to your email to continue</p>
        <h4>We&apos;ve sent a 6-digit verification code to:</h4>

        <h3>{maskEmail(email)}</h3>

        <VerificationCodeInput
          length={6}
          onSubmit={handleSubmit}
          email={email}
          setSuccess={setSuccess}
          onTooManyAttempts={handleTooManyAttempts} // 👈
        />
        {/* <p>Code in parent state: {code}</p> */}
        <div className={styles.buttons}>
          {/* <p
            className={styles.button}
            //onClick={() => handleClose(option1)}
          >
            Verify Email
          </p>{" "} */}
          <div className={styles.countdownTimer}>
            Code expires in{"    "}
            <CountdownTimer initialMinutes={10} onEnd={handleTimerEnd} />
          </div>
          {/* <button
            className={styles.button}
            // onClick={handleClose}
            onClick={() => handleClose(onCancel)}
          >
            Back To Sign Up
          </button> */}
          {/* <button
            className={styles.button}
            style={{ background: "#2563eb", color: "white" }}
            onClick={() => handleClose(option2)}
          >
            Option 2
          </button> */}
        </div>
      </div>
    </div>
  );
}
