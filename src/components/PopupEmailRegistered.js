import { useState, useEffect } from "react";
import styles from "./css-modules/popupemailregistered.module.css";
import Mail from "@/components-ui/svg-components/Mail";

export default function PopupEmailRegistered({
  onChoice,
  onCancel,
  option1,
  option2,
  message,
}) {
  const [closing, setClosing] = useState(false);

  const handleClose = (callback) => {
    setClosing(true);
    setTimeout(() => {
      callback();
    }, 2000); // match CSS fadeOut duration
  };

  return (
    <div
      className={`${styles.overlay} ${closing ? styles.overlayClosing : ""}`}
    >
      <div className={`${styles.popup} ${closing ? styles.popupClosing : ""}`}>
        <div className={styles.mailSvg}>
          <Mail />
        </div>
        <h1>{message}</h1>
        <p>
          The email you are trying to use has already been used to register for
          Doclitic. Please use a different email, or sign-in Instead
        </p>
        <div className={styles.buttons}>
          <button
            className={styles.button}
            //onClick={() => handleClose(option1)}
          >
            Sign In
          </button>{" "}
          <button
            className={styles.button}
            // onClick={handleClose}
            onClick={() => handleClose(onCancel)}
          >
            Back To Sign Up
          </button>
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
