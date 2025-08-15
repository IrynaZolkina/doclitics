"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { addToast } from "../redux/store";

export default function ClientToastHandler() {
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  useEffect(() => {
    const registered = searchParams.get("registered");
    const error = searchParams.get("error");

    if (registered === "1") {
      dispatch(
        addToast({
          id: Date.now(),
          message: "Registration successful! Please login.",
          type: "success",
        })
      );
    }

    if (error === "invalid_token") {
      dispatch(
        addToast({
          id: Date.now(),
          message: "Invalid activation link.",
          type: "error",
        })
      );
    }

    if (error === "expired_token") {
      dispatch(
        addToast({
          id: Date.now(),
          message: "Activation link expired.",
          type: "error",
        })
      );
    }
  }, [searchParams, dispatch]);

  return null;
}
