"use client";

import styles from "./userprofile.module.css";
import Image from "next/image";
import { useDispatch } from "react-redux";
import FlexibleButton from "@/components-ui/buttons/FlexibleButton";
import { clearUser } from "@/redux/store";
import { apiFetch } from "@/lib/apiFetch";
import { useRouter } from "next/navigation";
import { toastSuperFunctionJS } from "@/components-ui/toasts/toastSuperFunctionJS";
import Link from "next/link";

const UserProfile = ({ username, plan, docsAmount, picture }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  // const router = useRouter();

  const handleLogout = async () => {
    try {
      await apiFetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout failed:", err);
      toastSuperFunctionJS("Logout failed" + err, "error");
    } finally {
      dispatch(clearUser());
      // router.push("/");
      // window.location.href = "/";
    }
  };

  return (
    <div className={styles.userProfileContainer}>
      <FlexibleButton
        onClick={() => router.push("/dashboard")}
        variant="secondary"
        fontSize="13px"
        borderRadius="14px"
        padding="14px 30px"
        fontWeight="800"
      >
        Dashboard
      </FlexibleButton>
      <FlexibleButton
        onClick={handleLogout}
        variant="secondary"
        fontSize="13px"
        borderRadius="14px"
        padding="14px 30px"
        fontWeight="800"
      >
        Logout
      </FlexibleButton>

      <div className={styles.userPicture}>
        {picture ? (
          <Link href="/pages/profile">
            <Image src={picture} alt="Profile" width={50} height={50} />
          </Link>
        ) : (
          <div className={styles.initials}>{username.slice(0, 1)}</div>
        )}
      </div>
      <div className={styles.userDetails}>
        <span className={styles.plan}>{plan}</span>
        <span className={styles.docsAmount}>{docsAmount} docs</span>
      </div>
    </div>
  );
};

export default UserProfile;
