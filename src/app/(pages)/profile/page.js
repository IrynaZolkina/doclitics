"use client";
import { apiFetch } from "@/lib/apiFetch";
import styles from "./profilepage.module.css";
import { toastSuperFunctionJS } from "@/components-ui/toasts/toastSuperFunctionJS";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "@/redux/store";
import FlexibleButton from "@/components-ui/buttons/FlexibleButton";
import { useState } from "react";
import ConfirmPopup from "@/lib/ConfirmPopup";
import Image from "next/image";

const ProfilePage = () => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const { username, email, picture, plan, totalDocs, docsAmount } = useSelector(
    (state) => state.user,
  );
  const user = useSelector((state) => state.user);
  console.log("user----", user);

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

  async function handleUnsubscribe() {
    if (loading) return;

    const ok = confirm(
      "Cancel at period end? You'll keep access until your current period ends.",
    );
    if (!ok) return;

    setLoading(true);
    try {
      const res = await apiFetch("/api/billing/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}), // no mode needed
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data?.message || "Unsubscribe failed");
        return;
      }

      const ends = data?.accessEndsAt ? new Date(data.accessEndsAt) : null;

      alert(
        ends
          ? `Unsubscribe scheduled. Access ends on: ${ends.toLocaleString()}`
          : "Unsubscribe scheduled.",
      );

      onSuccess?.(data); // e.g. trigger refetch user
    } catch (e) {
      alert("Network error");
    } finally {
      setLoading(false);
    }
  }
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
        <h4>Manage your account details</h4>
        <div className={styles.info_block}>
          <h2>Account Information</h2>
          <div className={styles.account_info_grid}>
            <div className={styles.account_info_grid_name}>
              <div className={styles.userPicture}>
                {/* {picture ? (
                  <Image src={picture} alt="Profile" width={50} height={50} />
                ) : ( */}
                <div className={styles.initials}>
                  {username ? username.slice(0, 1) : ""}
                </div>
                {/* )} */}
              </div>
              <div>
                Name
                <p>{username}</p>
              </div>
            </div>
            <div className={styles.account_info_grid_email}>Email</div>
          </div>
        </div>
        <div className={styles.subscription_block}>
          <h2>Subscription Details</h2>
          <div className={styles.account_info_grid}>
            <p>
              Plan :<span>{plan}</span>
            </p>
            <p>
              Plan :<span>{plan}</span>
            </p>
          </div>
          <div className={styles.line}></div>
          <h3 onClick={handleUnsubscribe} disabled={loading}>
            Unsubscribe
          </h3>
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
