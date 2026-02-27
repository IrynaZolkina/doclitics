"use client";
import styles from "./profilepage.module.css";

import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";

import { apiFetch } from "@/lib/apiFetch";
import { toastSuperFunctionJS } from "@/components-ui/toasts/toastSuperFunctionJS";
import { clearUser } from "@/redux/store";
import FlexibleButton from "@/components-ui/buttons/FlexibleButton";
import ConfirmPopup from "@/lib/ConfirmPopup";
import CardIcon from "@/components-svg/CardIcon";
import UploadIcon from "@/components-svg/UploadIcon";
import { useRouter } from "next/navigation";
import UserIcon from "@/components-svg/UserIcon";
import MailIcon from "@/components-svg/MailIcon";
import ClockSyncIcon from "@/components-svg/ClockSyncIcon";
import CalendarIcon from "@/components-svg/CalendarIcon";
import TrashIcon from "@/components-svg/TrashIcon";

const ProfilePage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const {
    username,
    email,
    picture,
    plan,
    totalDocs,
    docsAmount,
    cancelAtPeriodEnd,
    currentPeriodEnd,
  } = user;

  // one popup for everything
  //
  const [confirm, setConfirm] = useState({
    open: false,
    titleIcon: null, // 👈 add this
    titleLine1: "",
    titleLine2: "",
    titleLine1Color: "#111",
    titleLine2Color: "#666",

    messageLine1: "",
    messageLine2: "",

    yesText: "Yes",
    noText: "Cancel",

    yesBorderColor: "#000",

    loading: false,
    disableBackdropClose: false,
    onYes: null,
  });

  const closeConfirm = () =>
    setConfirm((c) => ({
      ...c,
      open: false,
      loading: false,
      disableBackdropClose: false,
      onYes: null,
    }));

  const openConfirm = ({
    titleIcon = null,
    titleLine1,
    titleLine2 = "",
    titleLine1Color = "#111",
    titleLine2Color = "#666",
    messageLine1 = "",
    messageLine2 = "",
    yesText = "Yes",
    noText = "Cancel",
    yesBorderColor = "#000",
    disableBackdropClose = false,
    onYes,
  }) => {
    setConfirm({
      open: true,
      titleIcon, // 👈 pass it
      titleLine1,
      titleLine2,
      titleLine1Color,
      titleLine2Color,
      messageLine1,
      messageLine2,
      yesText,
      noText,
      yesBorderColor,
      loading: false,
      disableBackdropClose,
      onYes,
    });
  };
  const runConfirmYes = async () => {
    if (!confirm.onYes || confirm.loading) return;

    // store the callback first (because closeConfirm will clear it)
    const fn = confirm.onYes;

    // close current popup immediately, so Step2 can open cleanly
    closeConfirm();

    try {
      await fn();
    } catch (e) {
      console.error(e);
      toastSuperFunctionJS(
        e?.message ? String(e.message) : "Action failed",
        "error",
      );
    }
  };

  // -----------------------
  // Actions (real API calls)
  // -----------------------
  const doLogout = async () => {
    await apiFetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    dispatch(clearUser());
  };

  // const handleLogout = async () => {
  //   try {
  //     await apiFetch("/api/auth/logout", {
  //       method: "POST",
  //       credentials: "include",
  //     });
  //   } catch (err) {
  //     console.error("Logout failed:", err);
  //     toastSuperFunctionJS("Logout failed" + err, "error");
  //   } finally {
  //     dispatch(clearUser());
  //     router.push("/");

  //   }
  // };

  const doUnsubscribe = async () => {
    const res = await apiFetch("/api/billing/unsubscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.message || "Unsubscribe failed");
    }

    const ends = data?.accessEndsAt ? new Date(data.accessEndsAt) : null;

    toastSuperFunctionJS(
      ends
        ? `Unsubscribe scheduled. Access ends on: ${ends.toLocaleDateString(
            "en-GB",
            { day: "2-digit", month: "long", year: "numeric" },
          )}`
        : "Unsubscribe scheduled.",
      "success",
    );

    // optional: trigger a refetch user here if you have it
  };

  const doDeleteAccount = async () => {
    const res = await apiFetch("/api/account/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.message || "Delete account failed");
    }

    dispatch(clearUser());
    toastSuperFunctionJS("Account deleted.", "success");
  };
  // -----------------------
  // “Ask” wrappers (open popup)
  // -----------------------
  const askLogout = () => {
    openConfirm({
      titleIcon: <UserIcon size={28} />, // 👈 here
      titleLine1: "Log out?",
      titleLine2: "You’ll be signed out.",

      yesText: "Logout",

      titleLine1Color: "rgba(255, 255, 255, 1)",
      titleLine2Color: "rgba(255, 255, 255, 1)",
      // yesBorderColor: "#3C83F6",

      messageLine1: "You can log back in anytime.",

      noText: "Back to Profile",

      onYes: async () => {
        try {
          await doLogout();
        } catch (e) {
          throw new Error("Logout failed");
        }
      },
    });
  };

  const askUnsubscribe = () => {
    // if (cancelAtPeriodEnd) return;

    openConfirm({
      titleIcon: <UserIcon size={28} />, // 👈 here
      titleLine1: "Are you sure you want to",
      titleLine2: "unsubsribe?",
      titleLine1Color: "rgba(255, 255, 255, 1)",
      titleLine2Color: "rgba(255, 255, 255, 1)",
      // yesBorderColor: "#3C83F6",

      messageLine1:
        "You’ll keep access to AI summarization until the end of your billing cycle. After, you",
      messageLine2:
        "will lose access to all of your documents and premium features.",
      yesText: "Unsubscribe",
      noText: "Back to Profile",
      onYes: async () => {
        await doUnsubscribe();
      },
    });
  };

  const askDeleteAccountStep1 = () => {
    openConfirm({
      titleIcon: <UserIcon size={28} />, // 👈 here
      titleLine1: "Are you sure you want to",
      titleLine2: "delete your account?",
      titleLine1Color: "rgba(255, 255, 255, 1)",
      titleLine2Color: "rgba(246, 78, 78, 1)",

      messageLine1:
        "This will permanently delete your account and cancel your active subscription.",
      messageLine2:
        "All access will be lost immediately and cannot be restored. ",
      yesBorderColor: "1px solid rgba(246, 78, 78, 1)",
      yesText: "Yes, I want to Delete my account",
      noText: "Back to Profile",
      onYes: async () => {
        // After the first confirmation, open the second one
        askDeleteAccountStep2();
      },
    });
  };

  const askDeleteAccountStep2 = () => {
    openConfirm({
      titleIcon: <UserIcon size={28} />, // 👈 here
      titleLine1: "Delete account?",
      titleLine2: "This action is irreversible.",
      titleLine1Color: "#D92D20",
      titleLine2Color: "#B42318",
      messageLine1:
        "Your account and subscription will be deleted immediately and cannot be recovered.",

      yesBorderColor: "1px solid rgba(246, 78, 78, 1)",
      yesText: "Yes, I want to Delete my account",

      noText: "Back to Profile",
      onYes: async () => {
        // show loading on step2 popup
        setConfirm((c) => ({
          ...c,
          loading: true,
          disableBackdropClose: true,
        }));
        // await doDeleteAccount();
      },
    });
  };
  return (
    <div className={styles.wrapper}>
      {/* <button style={{ color: "red" }} onClick={() => setOpen(true)}>
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
      /> */}
      <ConfirmPopup
        open={confirm.open}
        titleIcon={confirm.titleIcon} // ✅ ADD THIS
        titleLine1={confirm.titleLine1}
        titleLine2={confirm.titleLine2}
        titleLine1Color={confirm.titleLine1Color}
        titleLine2Color={confirm.titleLine2Color}
        messageLine1={confirm.messageLine1}
        messageLine2={confirm.messageLine2}
        yesText={confirm.loading ? "Please wait..." : confirm.yesText}
        noText={confirm.noText}
        yesBorderColor={confirm.yesBorderColor}
        loading={confirm.loading}
        disableBackdropClose={confirm.disableBackdropClose}
        onNo={closeConfirm}
        onYes={runConfirmYes}
      />

      <div className={styles.container}>
        <h1>Profile </h1>
        <h4>Manage your account details</h4>

        <div className={styles.info_block}>
          <div className={styles.info_block_title}>
            <UserIcon width={26} height={26} />
            <h2>Account Information</h2>
          </div>
          <div className={styles.account_info_grid}>
            <div className={styles.account_info_grid_name}>
              <div className={styles.userPicture}>
                {/* {picture ? (
                  <Image src={picture} alt="Profile" width={50} height={50} />
                ) : ( */}
                <div className={styles.initials}>
                  {username ? username.slice(0, 2).toUpperCase() : ""}
                </div>
                {/* )} */}
              </div>
              <div>
                <h6>Name:</h6>
                <h5>{username}</h5>
              </div>
            </div>
            <div className={styles.account_info_grid_email}>
              <span>
                <MailIcon width={16} height={13} />
              </span>
              <div>
                <h6>Email Address:</h6>

                <h5>{email}</h5>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.info_block}>
          <div className={styles.info_block_title}>
            <span>
              <CardIcon size={26} />
            </span>
            <h2> Subscription Details</h2>
          </div>
          <div className={styles.account_info_grid}>
            <div className={styles.subscription_grid_left}>
              <h6>
                Current Plan<span>{plan && plan.toUpperCase()}</span>
              </h6>
              <FlexibleButton
                // icon={<CardIcon size={16} color="#3C83F6" />}
                onClick={askUnsubscribe}
                variant="quaternary"
                fontSize="13px"
                borderRadius="14px"
                padding="14px 30px"
                fontWeight="800"
                border
                disabled="cancelAtPeriodEnd?true:false"
              >
                <CardIcon size={16} color="#3C83F6" />
                {cancelAtPeriodEnd ? "You Are Unsubscribed" : " Unsubscribe"}
              </FlexibleButton>
            </div>
            <div className={styles.subscription_grid_right}>
              <section>
                <span>
                  <ClockSyncIcon size={20} />
                </span>
                <div>
                  <h6>Document Balance:</h6>
                  <h5>
                    <span>{user.docsAmount}</span> documents remaining
                  </h5>
                </div>
              </section>
              <section>
                <span>
                  <CalendarIcon size={16} />
                </span>
                <div>
                  <h6>
                    {cancelAtPeriodEnd
                      ? "Your Plan Ends on:"
                      : "Next billing Date:"}
                  </h6>
                  <h5>
                    <p>
                      {new Date(currentPeriodEnd).toLocaleString("en-GB", {
                        month: "long",
                        day: "2-digit",
                        year: "numeric",
                        // hour: "2-digit",
                        // minute: "2-digit",
                      })}
                    </p>
                  </h5>
                </div>
              </section>
            </div>
          </div>
        </div>
        <div className={`${styles.info_block} ${styles.buttons_block}`}>
          <FlexibleButton
            // icon={
            //   <UploadIcon rotate={90} width={25} height={22} />
            // }
            onClick={askLogout}
            variant="quaternary"
            fontSize="13px"
            borderRadius="14px"
            padding="14px 30px"
            fontWeight="800"
            border
          >
            <UploadIcon rotate={90} width={20} height={20} color="#3C83F6" />
            Logout
          </FlexibleButton>

          <FlexibleButton
            // icon={
            //   <UploadIcon rotate={90} width={20} height={20} color="#3C83F6" />
            // }
            onClick={askDeleteAccountStep1}
            variant="quaternary"
            fontSize="13px"
            borderRadius="14px"
            padding="14px 30px"
            fontWeight="800"
            border
          >
            <span>
              <TrashIcon />
            </span>
            <span>Delete Account</span>
          </FlexibleButton>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
