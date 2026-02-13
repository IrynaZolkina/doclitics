"use client";

import styles from "./header.module.css";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";

import Doclitic2 from "@/components-ui/svg-components/Doclitic2";

import UserProfile from "../userprofile/UserProfile";

import Login from "@/components/auth/login/Login";
import { useEffect, useRef } from "react";
import { apiFetch } from "@/lib/apiFetch";
import {
  clearUser,
  setUser,
  setUserSummaries,
  addUserSummary,
  clearUserSummaries,
} from "@/redux/store";

const Header = () => {
  const dispatch = useDispatch();
  // const user = useSelector((state) => state.user);

  const {
    isAuthenticated,
    authChecked,
    username,
    picture,
    plan,
    docsAmount,
    userSummaries,
  } = useSelector((state) => state.user);

  console.log("Header user.userSummaries:", userSummaries);
  // const isAuthenticated = user.isAuthenticated;

  // prevents double execution in React Strict Mode
  const bootedRef = useRef(false);

  useEffect(() => {
    if (bootedRef.current) return;
    bootedRef.current = true;

    (async () => {
      try {
        const res = await apiFetch("/api/auth/me", { method: "GET" });

        if (!res) {
          // apiFetch returned null (network / refresh failure)
          dispatch(clearUser());
          return;
        }

        if (res.ok) {
          const data = await res.json();
          dispatch(setUser(data.data.user));
          dispatch(setUserSummaries(data.data.userSummaries));

          // console.log("data-------------------", data.data);
        } else {
          dispatch(clearUser());
        }
      } catch (err) {
        console.error("Header auth boot error:", err);
        dispatch(clearUser());
      }
    })();
  }, [dispatch]);
  return (
    <>
      <div className={styles.headerContainer}>
        <div className={styles.container}>
          <div className={styles.flexContainer}>
            <Link href="/" className={styles.logoBox}>
              <Doclitic2 width={30} height={30} />
              <span className={styles.logoText}>Doclitic</span>
            </Link>

            {/* 
            While auth is not checked yet:
            - show nothing
            - or a skeleton / spinner if you want
          */}
            {!authChecked ? null : isAuthenticated ? (
              <UserProfile
                username={username}
                picture={picture}
                plan={plan}
                docsAmount={docsAmount}
              />
            ) : (
              <Login />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
