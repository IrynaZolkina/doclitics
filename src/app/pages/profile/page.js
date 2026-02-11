"use client";
import { apiFetch } from "@/lib/apiFetch";
import styles from "./profilepage.module.css";
import { toastSuperFunctionJS } from "@/components-ui/toasts/toastSuperFunctionJS";
import { useDispatch } from "react-redux";
import { clearUser } from "@/redux/store";
import FlexibleButton from "@/components-ui/buttons/FlexibleButton";
import { useState } from "react";
import ConfirmPopup from "@/lib/ConfirmPopup";

const ProfilePage = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

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

  const handleDelete = async () => {
    setOpen(false); // close popup first

    // ✅ this is your "return value"
    // do the real action here
    await deleteDocument();
  };

  return (
    <div className={styles.wrapper}>
      <button style={{ color: "red" }} onClick={() => setOpen(true)}>
        Open modal
      </button>

      <ConfirmPopup
        open={open}
        title="Delete file?"
        message="This cannot be undone."
        onNo={() => setOpen(false)}
        onYes={() => {
          onYes = { handleDelete };
          setOpen(false);
        }}
      />
      <div className={styles.container}>
        <h1>Profile </h1>
        <div className={styles.info_block}>
          <h2>Account Information</h2>
        </div>
        <div className={styles.info_block}>
          <h2>Subscription Details</h2>
          <div className={styles.line}></div>
          <h4>Unsubscribe</h4>
        </div>
        <div className={styles.info_block}>
          <FlexibleButton
            onClick={handleLogout}
            variant="quaternary"
            fontSize="13px"
            borderRadius="14px"
            padding="14px 30px"
            fontWeight="800"
            border
          >
            Logout
          </FlexibleButton>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
