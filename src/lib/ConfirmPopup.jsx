"use client";

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import styles from "./ConfirmPopup.module.css";
import FlexibleButton from "@/components-ui/buttons/FlexibleButton";

export default function ConfirmPopup({
  open,
  titleIcon = null,
  // ✅ Two-line title
  titleLine1 = "Are you sure?",
  titleLine2 = "",

  titleLine1Color = "#216490",
  titleLine2Color = "#666",

  messageLine1 = "",
  messageLine2 = "",

  yesText = "Yes",
  noText = "No",

  yesBorderColor = "#000",

  onYes,
  onNo,
  disableBackdropClose = false,

  loading = false,
  disableYes = false,
  disableNo = false,
}) {
  const [modalRoot, setModalRoot] = useState(null);

  useEffect(() => {
    setModalRoot(document.getElementById("modal-root"));
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.classList.add("modalOpen");
    return () => document.body.classList.remove("modalOpen");
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        if (disableBackdropClose || loading) return;
        onNo?.();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, disableBackdropClose, loading, onNo]);

  // if (!open || !modalRoot) return null;
  const [mounted, setMounted] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (!modalRoot) return;

    if (open) {
      setMounted(true);
      setClosing(false);
      return;
    }

    // open === false → play exit anim then unmount
    if (mounted) {
      setClosing(true);
      const t = setTimeout(() => {
        setMounted(false);
        setClosing(false);
      }, 180); // must match CSS duration
      return () => clearTimeout(t);
    }
  }, [open, modalRoot, mounted]);

  if (!mounted || !modalRoot) return null;

  const close = () => {
    if (disableBackdropClose || loading) return;
    onNo?.();
  };

  const handleNo = () => {
    if (loading || disableNo) return;
    onNo?.();
  };

  const handleYes = () => {
    if (loading || disableYes) return;
    onYes?.();
  };

  return createPortal(
    <div
      className={`${styles.backdrop} ${closing ? styles.backdropExit : styles.backdropEnter}`}
      onClick={close}
      role="dialog"
      aria-modal="true"
      aria-busy={loading ? "true" : "false"}
    >
      <div
        className={`${styles.modal} ${closing ? styles.modalExit : styles.modalEnter}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Two-line title */}
        <div className={styles.titleWrapper}>
          <h3 className={styles.titleLine1} style={{ color: titleLine1Color }}>
            {titleLine1}
          </h3>

          {titleLine2 && (
            <h4
              className={styles.titleLine2}
              style={{ color: titleLine2Color }}
            >
              {titleLine2}
            </h4>
          )}
        </div>

        {messageLine1 && <p className={styles.message}>{messageLine1}</p>}
        {messageLine2 && <p className={styles.message}>{messageLine2}</p>}

        <div className={styles.buttons}>
          {/* <button
            className={styles.noBtn}
            type="button"
            onClick={handleNo}
            disabled={loading || disableNo}
          >
            {noText}
          </button> */}

          <FlexibleButton
            onClick={handleNo}
            disabled={loading || disableNo}
            variant="primary"
            fontSize="13px"
            borderRadius="14px"
            padding="14px 30px"
            fontWeight="800"
          >
            {titleIcon && <div className={styles.titleIcon}>{titleIcon}</div>}
            {noText}
          </FlexibleButton>
          {/* <button
            className={styles.yesBtn}
            type="button"
            onClick={handleYes}
            disabled={loading || disableYes}
            style={{
              borderColor: yesBorderColor,
              color: yesBorderColor,
            }}
          >
            {loading ? "Please wait..." : yesText}
          </button> */}

          <FlexibleButton
            // icon={<UploadIcon rotate={90} width={25} height={22} />}
            onClick={handleYes}
            variant="quaternary"
            fontSize="13px"
            borderRadius="14px"
            padding="14px 30px"
            fontWeight="800"
            disabled={loading || disableYes}
            border={yesBorderColor}
          >
            {loading ? "Please wait..." : yesText}
          </FlexibleButton>
        </div>
      </div>
    </div>,
    modalRoot,
  );
}
