// components/UserLoader.jsx
"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUserLogin } from "@/redux/store";
import { apiFetch } from "@/utils/apiFetch";
import { toastSuperFunction } from "@/components-ui/ToastSuper";
import { toastSuperFunctionJS } from "@/components-ui/toastSuperFunctionJS";

export default function UserLoader({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      // Call protected route; credentials include HttpOnly cookie automatically
      try {
        const res = await apiFetch("/api/auth/me", {
          method: "GET",
          credentials: "include",
        });
        // apiFetch may return undefined if refresh failed
        if (!res) return;
        console.log("UserLoader /api/auth/me response: ", res);
        // const data = await res.json();
        const result = await res.json();

        if (!result.success) {
          //console.error(result.error.message);
          // optional toast, depends if you want UX feedback on failed auth
          // toastSuperFunction(result.error.message, "error");
          //toastSuperFunction(result.error.message, "error");
          return;
        }
        const { user } = result.data;

        dispatch(
          setUserLogin({
            username: user.username,
            email: user.email,
            userCategory: user.category,
            picture: user.picture || "",
          })
        );
      } catch (err) {
        toastSuperFunctionJS("Failed to fetch user:", err);
        //console.error("÷Failed to fetch user:", err);
      }
    };

    fetchCurrentUser();
  }, [dispatch]);

  return <>{children}</>;
}
