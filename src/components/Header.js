"use client";
import "../app/globals.css";
import styles from "./css-modules/header.module.css";

import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

import DocliticLogo from "@/components-ui/svg-components/DocliticLogo";
import { setUserLogout } from "@/redux/store";
import { apiFetch } from "@/lib/apiFetch";
import Doclitic2 from "@/components-ui/svg-components/Doclitic2";

const Header = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const username = useSelector((state) => state.userNameSlice.username);
  const picture = useSelector((state) => state.userNameSlice.picture);

  async function uLogout() {
    // const dispatch = useDispatch();
    // async function logOut() {
    try {
      console.log("Logout clicked");

      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      // Clear Redux user state
      dispatch(setUserLogout());

      // Redirect to login page if needed
      router.push("/");
    } catch (err) {
      console.error(err);
    }
    // }

    // return logOut;
  }
  const test = () => {
    alert("Button clicked");
  };

  async function getSummary() {
    try {
      const res = await apiFetch("/api/summary");
      // if (!res.ok) {
      //   console.error("Failed to fetch summary");
      //   return null;
      // }
      const data = await res.json();
      console.log("Summary data:", data);
      return data;
    } catch (error) {
      console.error("Error fetching summary:", error);
      return null;
    }
  }
  return (
    <>
      {/* {user.isLoggedIn ? (
        <>
          <p>Username: {user.username.slice(0, 2)}</p>
        </>
      ) : (
        <p className={styles.initials}>{"ANDREW".slice(0, 2)}</p>
      )} */}
      <div className={styles.headerContainer}>
        <div className={styles.container}>
          <div className={styles.flexContainer}>
            {/* Logo */}
            <div className={styles.flexLogo}>
              {/* <div> */}
              {/* <Image src="Group 1.svg" alt="Logo" width={40} height={40} /> */}
              <button className={styles.test} onClick={uLogout}>
                LOGOUT
              </button>
              {/* <Image src="Group 1.svg" alt="Logo" width={40} height={40} /> */}
              <button className={styles.stest} onClick={getSummary}>
                SUMMARY
              </button>
              <Link href="/" className={styles.logoBox}>
                <Doclitic2 width={30} height={30} />
                {/* <Image src="Rectangle.svg" width={30} height={30} alt="Logo" /> */}
                <span className={styles.logoText}>Doclitic</span>
              </Link>
              {/* </div> */}
            </div>
          </div>
          <div>
            {picture ? (
              <p className={styles.picture}>
                <Image src={picture} alt="Logo" width={50} height={50} />
              </p>
            ) : (
              <p className={styles.initials}>
                {username.slice(0, 1)}
                {/* {"ANDREW".slice(0, 1)} */}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
