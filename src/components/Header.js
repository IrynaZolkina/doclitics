"use client";
import "../app/globals.css";
import styles from "./css-modules/header.module.css";

import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

import DocliticLogo from "@/components-ui/svg-components/DocliticLogo";
import { setUserLogin, setUserLogout } from "@/redux/store";
import { apiFetch } from "@/utils/apiFetch";
import Doclitic2 from "@/components-ui/svg-components/Doclitic2";
import UserLoader from "./UserLoader";
import { useEffect } from "react";
import { toastSuperFunctionJS } from "@/components-ui/toastSuperFunctionJS";

const Header = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const username = useSelector((state) => state.userNameSlice.username);
  const picture = useSelector((state) => state.userNameSlice.picture);
  console.log("username in header:", username);
  console.log("picture in header:", picture);
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
        console.log("User: ", result.data);
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
        toastSuperFunctionJS("Failed to fetch user:" + err);
        //console.error("÷Failed to fetch user:", err);
      }
    };

    fetchCurrentUser();
  }, [dispatch]);

  async function uLogout() {
    // const dispatch = useDispatch();
    // async function logOut() {
    try {
      console.log("Logout clicked");

      await apiFetch("/api/auth/logout", {
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
      {/* <UserLoader /> */}
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
              {/* <button className={styles.stest} onClick={getSummary}>
                SUMMARY
              </button> */}
              <Link href="/" className={styles.logoBox}>
                <Doclitic2 width={30} height={30} />
                {/* <Image src="Rectangle.svg" width={30} height={30} alt="Logo" /> */}
                <span className={styles.logoText}>Doclitic</span>
              </Link>
              {/* </div> */}
            </div>
          </div>
          {username && (
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
          )}
        </div>
      </div>
    </>
  );
};

export default Header;
