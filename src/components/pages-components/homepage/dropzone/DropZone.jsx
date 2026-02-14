"use client";
import styles from "./dropzone.module.css";

import { useDispatch } from "react-redux";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { setCurrentFileMeta } from "@/redux/store";
import { saveFileToIndexedDB } from "@/lib/indexeddb";
import { toastSuperFunctionJS } from "@/components-ui/toasts/toastSuperFunctionJS";
import DocIcon from "../../../../components-svg/DocIcon";
import UploadIcon from "../../../../components-svg/UploadIcon";

const allowedTypes = [
  "application/pdf",
  // "text/plain",
  // "application/msword",
  // "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

const DropZone = () => {
  const [drag, setDrag] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const dragCounter = useRef(0);
  const fileHandlingRef = useRef(false);

  const dragEnterHandler = (e) => {
    e.preventDefault();
    dragCounter.current++;
    setDrag(true);
  };
  const dragLeaveHandler = (e) => {
    e.preventDefault();
    dragCounter.current--;
    if (dragCounter.current <= 0) {
      dragCounter.current = 0;
      setDrag(false);
    }
  };

  const dragOverHandler = (e) => {
    e.preventDefault();
  };

  const handleFileChange = async (event, fromDrop = false) => {
    if (fileHandlingRef.current) return;
    fileHandlingRef.current = true;

    try {
      let chosenFile = null;
      if (fromDrop) {
        event.preventDefault();
        const files = event.dataTransfer?.files;
        if (!files?.length) return;
        if (files.length > 1) {
          toastSuperFunctionJS("Please drop one file at a time.", "warning");
        }
        chosenFile = files[0];
        dragCounter.current = 0;
        setDrag(false);
      } else {
        chosenFile = event.target.files?.[0] ?? null;
        dragCounter.current = 0;
        setDrag(false);
      }
      if (!chosenFile) return;
      if (!chosenFile.type) {
        toastSuperFunctionJS("Please drop a file, not a folder.", "error");
        return;
      }

      if (!chosenFile || !allowedTypes.includes(chosenFile.type)) {
        toastSuperFunctionJS("Unsupported file type", "error");
        return;
      }

      if (chosenFile.size > MAX_SIZE) {
        toastSuperFunctionJS("File too large (max 10MB)", "error");
        return;
      }
      // dispatch(
      //   setCurrentFileMeta({
      //     fileName: chosenFile.name,
      //     fileType: chosenFile.type,
      //     fileSize: chosenFile.size,
      //     // or actual base64 string if you generate it
      //   }),
      // );
      if (chosenFile) {
        try {
          await saveFileToIndexedDB("current-pdf", chosenFile);

          console.log("PDF saved to IndexedDB..");
          router.push("/summaryparams");
        } catch (err) {
          toastSuperFunctionJS("Failed to save file", "error");
        }
      }
    } catch (err) {
      toastSuperFunctionJS("Failed to save file", "error");
    } finally {
      // allow selecting the same file again
      if (!fromDrop && event?.target) event.target.value = "";
      fileHandlingRef.current = false;
    }
  };
  return (
    <div
      className={`${styles.heroDivImage} ${drag ? styles.dragActive : ""}`}
      onDragEnter={dragEnterHandler}
      onDragLeave={dragLeaveHandler}
      onDragOver={dragOverHandler}
      onDrop={(e) => handleFileChange(e, true)}
    >
      <UploadIcon
        width={64}
        height={64}
        strokeColor="var(--text-color-blue)"
        className={styles.my_upload_icon}
      />

      <h2>Drop your document here</h2>
      <p>Or click to browse &#11050; Supports PDF files</p>

      <label className={styles.label}>
        <DocIcon
          width={24}
          height={24}
          strokeColor="var(--background-one)"
          className="my-icon"
        />
        Choose file
        <input
          type="file"
          style={{ display: "none" }}
          onChange={handleFileChange}
          accept=".pdf,application/pdf"
          // accept=".pdf,.txt,.doc,.docx,application/pdf,text/plain,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        />
      </label>

      {drag && <div className={styles.dragImage} />}
    </div>
  );
};
export default DropZone;
