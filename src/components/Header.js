"use client";
import Image from "next/image";
import "../app/globals.css";
import styles from "./css-modules/header.module.css";
import DocliticLogo from "@/components-ui/svg-components/DocliticLogo";
import Link from "next/link";
import { useSelector } from "react-redux";

const Header = () => {
  const user = useSelector((state) => state.user);
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
              <Link href="/" className={styles.logoBox}>
                <DocliticLogo width={40} height={40} />
                <span className={styles.logoText}>Doclitic</span>
              </Link>
              {/* </div> */}
            </div>
          </div>
          <p className={styles.initials}>{"ANDREW".slice(0, 2)}</p>
        </div>
      </div>
    </>
  );
};

export default Header;
