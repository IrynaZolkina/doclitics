"use client";
import Image from "next/image";
import "./globals.css";
// import styles from "./page.module.css";
import { login } from "../redux/store";

import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import HomePage from "@/components/homepage";
// pages/index.jsx or app/page.jsx
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUserLogin } from "@/redux/store";
import { apiFetch } from "@/utils/apiFetch";
import { NavbarN } from "@/components/NavbarN";

export default function Home() {
  useScrollAnimation();

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
