"use client";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUserLogin } from "@/redux/store";
import InputSectionLogin from "@/components-ui/InputSectionLogin";
import { GoogleIcon } from "@/components-ui/svg-components/GoogleIcon";
import Link from "next/link";
import Protect from "@/components-ui/svg-components/Protect";
import { toastSuperFunction } from "@/components-ui/ToastSuper";

export default function PopupLogin({ onClose, error }) {
  const dispatch = useDispatch();

  const [closing, setClosing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [enteredEmail, setEnteredEmail] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");
  const [visiblePassword, setVisiblePassword] = useState(false);
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    if (error === "email")
      setLocalError("Please verify your email before logging in.");
  }, [error]);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => onClose?.(), 300); // match animation duration
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLocalError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: enteredEmail.toLowerCase(),
          password: enteredPassword,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setLocalError(data.error || "Login failed");
        toastSuperFunction(data.error, "error");
        return;
      }

      dispatch(
        setUserLogin({
          username: data.userInfo.username,
          email: data.userInfo.email,
          userCategory: data.userInfo.category,
        })
      );

      toastSuperFunction("✅ Logged in successfully!", "success");
      handleClose();
    } catch (err) {
      setLocalError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "/api/auth/google";
  };

  return (
    <>
      <div className={`overlay ${closing ? "overlayClosing" : ""}`}>
        <div className={`popup ${closing ? "popupClosing" : ""}`}>
          <button className="closeBtn" onClick={handleClose}>
            ✕
          </button>
          <h1>Your Summary is On The Way!</h1>
          <p>Please Sign In or create a free account</p>

          <button onClick={handleGoogleLogin} className="googleButton">
            <GoogleIcon /> Continue with Google
          </button>

          <div className="continueTextBlock">
            <span></span>
            <div className="continueText">or continue with email</div>
            <span></span>
          </div>

          {localError && <p className="error">{localError}</p>}

          <form onSubmit={handleSubmit} className="formBox">
            <InputSectionLogin
              id={2}
              enteredValue={enteredEmail}
              setEnteredValue={setEnteredEmail}
              labelText="Your Email"
              touched={true}
              setTouched={() => {}}
              inputType="email"
              fieldLength={50}
              correctMessage="Please enter a valid email address"
              placeholder="Enter your email address..."
            />

            <div className="passwordAndEye">
              <InputSectionLogin
                id={3}
                enteredValue={enteredPassword}
                setEnteredValue={setEnteredPassword}
                labelText="Your Password"
                touched={true}
                setTouched={() => {}}
                inputType={visiblePassword ? "text" : "password"}
                fieldLength={50}
                correctMessage="Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 symbol"
                placeholder="Enter your password..."
              />
              <button
                type="button"
                onClick={() => setVisiblePassword(!visiblePassword)}
              >
                {visiblePassword ? "🙈" : "👁️"}
              </button>
            </div>

            <h5 className="forgotPassword">Forgot password?</h5>

            <button type="submit" className="submitButton" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>

            <h6>
              <Protect />
              Your data is protected with enterprise-grade encryption
            </h6>

            <Link href="/pages/auth/register" onClick={handleClose}>
              New to Doclitic? Create your free account
            </Link>
          </form>
        </div>
      </div>

      <style jsx>{`
        /* .overlay {
          position: fixed;
          top: 0;
          left: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          background: rgba(5, 14, 31, 0.2);
          backdrop-filter: blur(5px);
          -webkit-backdrop-filter: blur(6px);
          animation: fadeIn 0.3s forwards;
        } */

        .overlayClosing {
          animation: fadeOut 0.3s forwards;
        }

        .popup {
          position: relative;
          background: rgba(18, 24, 35, 1);
          padding: 24px;
          border-radius: 12px;
          width: 448px;
          text-align: center;
          animation: scaleIn 0.3s forwards;
        }

        .popupClosing {
          animation: scaleOut 0.3s forwards;
        }

        .closeBtn {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: none;
          border: none;
          font-size: 1.2rem;
          cursor: pointer;
        }

        .googleButton {
          width: 100%;
          height: 56px;
          color: #1f2937;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          font-weight: bold;
          border-radius: 4px;
          border: 1px solid rgba(33, 44, 59, 0.4);
          cursor: pointer;
          margin-bottom: 20px;
        }

        .continueTextBlock {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 30px 0;
        }

        .continueTextBlock span {
          height: 1px;
          flex: 1;
          background-color: rgba(148, 163, 184, 1);
        }

        .continueText {
          margin: 0 10px;
          background: rgba(15, 19, 26, 0.8);
          padding: 4px 12px;
          border-radius: 20px;
          color: rgba(148, 163, 184, 1);
          font-size: 13px;
        }

        .error {
          color: red;
          margin-bottom: 0.5rem;
        }

        .formBox {
          margin-top: 20px;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .passwordAndEye {
          position: relative;
        }

        .passwordAndEye button {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
        }

        .submitButton {
          width: 100%;
          height: 50px;
          background: #3c83f6;
          color: antiquewhite;
          font-weight: bold;
          border-radius: 14px;
          border: none;
          cursor: pointer;
        }

        .submitButton:disabled {
          background: rgba(60, 131, 246, 0.3);
          color: rgba(255, 255, 255, 0.5);
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }

        @keyframes scaleIn {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes scaleOut {
          from {
            transform: scale(1);
            opacity: 1;
          }
          to {
            transform: scale(0.95);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
}
