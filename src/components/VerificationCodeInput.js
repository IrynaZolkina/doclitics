import { useState, useRef, useEffect } from "react";
import styles from "./css-modules/VerificationCodeInput.module.css";
import ToastSuper, { toastSuperFunction } from "@/components-ui/ToastSuper";
import ToastManual from "@/components-ui/ToastManual";

export default function VerificationCodeInput({
  length = 6,
  onSubmit,
  email,
  setSuccess,
}) {
  const [popupToastSuper, setPopupToastSuper] = useState(null);
  const [showToastSuper, setShowToastSuper] = useState(false);
  const [showToastManual, setShowToastManual] = useState(true);

  const [values, setValues] = useState(Array(length).fill(""));
  const [message, setMessage] = useState("");
  const inputsRef = useRef([]);

  useEffect(() => {
    // focus first input on mount
    inputsRef.current[0]?.focus();
  }, []);

  const handleChange = (e, idx) => {
    const val = e.target.value.replace(/[^0-9]/g, ""); // only digits
    if (!val) return;

    const newValues = [...values];
    newValues[idx] = val;
    setValues(newValues);

    // move focus to next input
    if (idx < length - 1 && val) {
      inputsRef.current[idx + 1].focus();
    }
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !values[idx] && idx > 0) {
      const newValues = [...values];
      newValues[idx - 1] = "";
      setValues(newValues);
      inputsRef.current[idx - 1].focus();
    }
  };
  const resetInputs = () => {
    setValues(Array(length).fill(""));
    inputsRef.current[0]?.focus();
  };
  const handleSubmit = async () => {
    const code = values.join("");
    // onSubmit(code); // send to parent
    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Verified!");
        setSuccess(true);

        onSubmit(code, true); // ✅ tell parent success
        // maybe redirect or close popup
        // Success
        setMessage("✅ Email verified successfully!");
      } else {
        setSuccess(false);
        resetInputs();
        if (data.code === "INVALID_CODE") {
          setMessage(`❌ Wrong code. ${data.remainingAttempts} attempts left.`);
        } else if (data.code === "TOO_MANY_ATTEMPTS") {
          setMessage("🚫 Too many attempts. Request a new code.");
        } else if (data.code === "CODE_EXPIRED") {
          showToastManual(
            "⏳ Code expired.",
            "warning",
            setPopupToastSuper,
            setShowToastSuper
          );
          setMessage("⏳ Code expired. Request a new one.");
        } else {
          setMessage("⚠️ Something went wrong.");
        }
      }

      // if (onSuccess) onSuccess(); // notify parent (optional)
    } catch (err) {
      console.error("Network error:", err);
      setMessage("⚠️ Network error. Please try again.");
    }
  };

  const isComplete = values.every((v) => v !== "");

  return (
    <div>
      {/* {popupToastSuper && (
        <ToastSuper
          popup={{ type: "success", message: "Email verified successfully!" }}
          show={showToastSuper}
          onClose={() => {
            setShowToastSuper(false), setPopupToastSuper(false);
          }}
        />
      )} */}
      {/* {showToastManual && (
        <ToastManual
          message="Manual close only"
          type="info"
          onClose={() => setShowToastManual(false)}
        />
      )} */}

      <div className={styles.container}>
        {values.map((val, idx) => (
          <input
            key={idx}
            type="text"
            maxLength="1"
            value={val}
            onChange={(e) => handleChange(e, idx)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            ref={(el) => (inputsRef.current[idx] = el)}
            className={styles.input}
          />
        ))}
      </div>
      <button
        onClick={handleSubmit}
        className={styles.button}
        disabled={!isComplete}
      >
        Verify
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}

// import { useState, useRef } from "react";
// import styles from "./css-modules/VerificationCodeInput.module.css";

// export default function VerificationCodeInput({ length = 6, onComplete }) {
//   const [values, setValues] = useState(Array(length).fill(""));
//   const inputsRef = useRef([]);

//   const handleChange = (e, index) => {
//     const val = e.target.value;

//     if (!/^\d?$/.test(val)) return; // only allow digits

//     const newValues = [...values];
//     newValues[index] = val;
//     setValues(newValues);

//     if (val && index < length - 1) {
//       inputsRef.current[index + 1].focus();
//     }

//     if (newValues.every((v) => v !== "")) {
//       onComplete(newValues.join(""));
//     }
//   };

//   const handleKeyDown = (e, index) => {
//     if (e.key === "Backspace" && !values[index] && index > 0) {
//       inputsRef.current[index - 1].focus();
//     }
//   };

//   return (
//     <div className={styles.container}>
//       {values.map((val, index) => (
//         <input
//           key={index}
//           type="text"
//           inputMode="numeric"
//           maxLength={1}
//           value={val}
//           onChange={(e) => handleChange(e, index)}
//           onKeyDown={(e) => handleKeyDown(e, index)}
//           ref={(el) => (inputsRef.current[index] = el)}
//           className={styles.input}
//         />
//       ))}
//     </div>
//   );
// }
