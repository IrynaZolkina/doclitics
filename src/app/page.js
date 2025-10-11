"use client";
import Image from "next/image";
import "./globals.css";
// import styles from "./page.module.css";

import { useScrollAnimation } from "@/hooks/useScrollAnimation";

import { NavbarN } from "@/components/NavbarN";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  useScrollAnimation();
  const router = useRouter();

  // useEffect(() => {
  //   const lastPage = localStorage.getItem("lastPage");
  //   if (lastPage && lastPage !== router.pathname) {
  //     localStorage.removeItem("lastPage"); // cleanup
  //     router.push(lastPage); // client-side redirect
  //   }
  // }, [router]);
  // useEffect(() => {
  //   const lastPage = localStorage.getItem("lastPage") || "/";
  //   localStorage.removeItem("lastPage"); // cleanup
  //   window.location.href = lastPage; // redirect user
  // }, []);

  // const dispatch = useDispatch();

  // useEffect(() => {
  //   const fetchCurrentUser = async () => {
  //     try {
  //       const res = await apiFetch("/api/auth/me", {
  //         method: "GET",
  //         credentials: "include", // ensures cookies are sent
  //       });

  //       if (!res.ok) return; // not logged in or session expired

  //       const data = await res.json();

  //       console.log("useeffect---", {
  //         username: data.user.username,
  //         email: data.user.email,
  //         userCategory: data.user.category,
  //       });

  //       dispatch(
  //         setUserLogin({
  //           username: data.user.username,
  //           email: data.user.email,
  //           userCategory: data.user.category,
  //           picture: data.user.picture || "",
  //         })
  //       );
  //     } catch (err) {
  //       console.error("Failed to fetch user:", err);
  //     }
  //   };

  //   fetchCurrentUser();
  // }, [dispatch]);

  return (
    <div>
      {/* <HomePage /> */}
      <NavbarN />
    </div>
  );
}
