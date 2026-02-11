import { useState, useRef, useEffect } from "react";
import styles from "./VerificationCodeInput.module.css";
import ToastSuper, {
  toastSuperFunction,
} from "@/components-ui/toasts/ToastSuper";
import ToastManual, {
  toastManualFunction,
} from "@/components-ui/toasts/ToastManual";

// import { showLoginPopup } from "./PopupLogin";
import { useRouter } from "next/navigation";

export default function VerificationCodeInput({
  length = 6,
  onSubmit,
  email,
  setSuccess,
  onChange,
  isOpen, /// reset when popup opens by watching a prop like isOpen.
}) {
  const [values, setValues] = useState(Array(length).fill(""));
  const [message, setMessage] = useState("");
  const inputsRef = useRef([]);

  const router = useRouter();

  useEffect(() => {
    // focus first input on mount
    inputsRef.current[0]?.focus();
  }, []);

  const handleChange = (e, idx) => {
    const val = e.target.value.replace(/[^0-9]/g, ""); // only digits
    if (!val) return;

    const newValues = [...values];
    // newValues[idx] = val;
    newValues[idx] = val.slice(-1); // only last digit
    setValues(newValues);

    // move focus to next input
    if (idx < length - 1 && val) {
      inputsRef.current[idx + 1].focus();
    }
    onChange?.(newValues.join(""));
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newValues = [...values];

      if (newValues[idx]) {
        newValues[idx] = "";
        setValues(newValues);
      } else if (idx > 0) {
        inputsRef.current[idx - 1].focus();
        newValues[idx - 1] = "";
        setValues(newValues);
      }

      onChange?.(newValues.join(""));
    }

    if (e.key === "ArrowLeft" && idx > 0) {
      inputsRef.current[idx - 1].focus();
    }

    if (e.key === "ArrowRight" && idx < length - 1) {
      inputsRef.current[idx + 1].focus();
    }
  };
  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").replace(/[^0-9]/g, "");
    if (!paste) return;

    const newValues = [...values];
    paste
      .split("")
      .slice(0, length)
      .forEach((char, i) => {
        newValues[i] = char;
      });

    setValues(newValues);
    onChange?.(newValues.join(""));

    // focus last filled input
    const lastIndex = Math.min(paste.length, length) - 1;
    if (lastIndex >= 0) {
      inputsRef.current[lastIndex].focus();
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
        setSuccess(true);
        toastSuperFunction(
          "✅ Email verified successfully! You can Login now",
          "success",
        );
        // onSubmit(code, true); // ✅ success → close popup + redirect to login
        // Go back to the page with login popup
        router.back();

        // Re-open login popup (small delay so navigation finishes first)
        // setTimeout(() => showLoginPopup(), 200);
        return;
      }

      // ❌ Failed cases
      setSuccess(false);
      resetInputs();
      if (data.code === "INVALID_CODE") {
        setMessage(`❌ Wrong code. ${data.remainingAttempts} attempts left.`);
      } else if (
        data.code === "TOO_MANY_ATTEMPTS" ||
        data.code === "CODE_EXPIRED"
      ) {
        toastManualFunction(
          data.code === "TOO_MANY_ATTEMPTS"
            ? "🚫 Too many attempts. Try registration again."
            : "⏳ Code expired. Try registration again.",
          "error",
        );
        onSubmit(code, false); // 🔴 tell parent to close + go back to register
      } else {
        setMessage("⚠️ Something went wrong.");
      }
    } catch (err) {
      toastSuperFunction("⚠️ Network error. Please try again.", "error");
    }
  };

  const isComplete = values.every((v) => v !== "");

  return (
    <div>
      <div className={styles.container} onPaste={handlePaste}>
        {values.map((val, idx) => (
          <input
            key={idx}
            ref={(el) => (inputsRef.current[idx] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={val}
            onChange={(e) => handleChange(e, idx)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
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
