"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { login } from "../../../../redux/store";

export default function AuthCallbackPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.slice(1));
    const access = params.get("access");
    const userStr = params.get("user");

    if (access && userStr) {
      const user = JSON.parse(decodeURIComponent(userStr));
      console.log("User from callback:", user);
      dispatch(
        login({ username: user.name, email: user.email, accessToken: access })
      );
    }

    // clean URL + redirect to home
    history.replaceState(null, "", "/");
    router.replace("/");
  }, [dispatch, router]);

  // return <p>Signing you in…</p>;
}
