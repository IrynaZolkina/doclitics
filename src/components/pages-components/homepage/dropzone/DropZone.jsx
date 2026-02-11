"use client";
import styles from "./dropzone.module.css";

import Image from "next/image";

import { useDispatch } from "react-redux";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { setCurrentFileMeta } from "@/redux/store";
import { saveFileToIndexedDB } from "@/lib/indexeddb";
import { toastSuperFunctionJS } from "@/components-ui/toasts/toastSuperFunctionJS";
import DocIcon from "../../../../components-svg/DocIcon";
import UploadIcon from "../../../../components-svg/UploadIcon";

const DropZone = () => {
  const [drag, setDrag] = useState(false);
  // const [file, setFile] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const allowedTypes = [
    "application/pdf",
    "text/plain",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB

  // **********
  // const showToast = (text, type = "info") => {
  //   dispatch(addToast({ id: Date.now(), type: type, message: text }));
  // };
  const dragCounter = useRef(0);

  const dragEnterHandler = (e) => {
    e.preventDefault();
    dragCounter.current++;
    setDrag(true);
  };
  const dragLeaveHandler = (e) => {
    e.preventDefault();
    dragCounter.current--;
    if (dragCounter.current === 0) setDrag(false);
  };

  const handleFileChange = async (event, fromDrop = false) => {
    let chosenFile;
    if (fromDrop && !event.dataTransfer?.files?.length) return;
    if (fromDrop) {
      event.preventDefault();
      chosenFile = event.dataTransfer.files[0];
      setDrag(false);
    } else {
      chosenFile = event.target.files[0];
    }
    if (!chosenFile || !allowedTypes.includes(chosenFile.type)) {
      toastSuperFunctionJS("Unsupported file type", "error");
      return;
    }

    if (chosenFile.size > MAX_SIZE) {
      toastSuperFunctionJS("File too large (max 10MB)", "error");
      return;
    }
    dispatch(
      setCurrentFileMeta({
        fileName: chosenFile.name,
        fileType: chosenFile.type,
        fileSize: chosenFile.size,
        // or actual base64 string if you generate it
      }),
    );
    if (chosenFile) {
      try {
        await saveFileToIndexedDB("current-pdf", chosenFile);

        console.log("PDF saved to IndexedDB..");
        router.push("/pages/summaryparams");
      } catch (err) {
        toastSuperFunctionJS("Failed to save file", "error");
      }
    }
  };
  return (
    <div>
      <div>
        {drag ? (
          <div
            className={styles.heroDivImage}
            onDragEnter={(e) => {
              (dragEnterHandler(e), console.log("onDragEnter"));
            }}
            onDragLeave={(e) => {
              (dragLeaveHandler(e), console.log("onDragLeave"));
            }}
            onDragOver={(e) => {
              (dragEnterHandler(e), console.log("onDragOver"));
            }}
            // onDrop={(e) => handleFileChange(e, 1)}
            onDrop={(e) => {
              (handleFileChange(e, true), console.log("onDrop"));
            }}
            // onChange={(e) => handleFileChange(e, false)}
          >
            <UploadIcon
              width={64}
              height={64}
              strokeColor="var(--text-color-blue)"
              className="my-upload-icon"
            />

            {/* <Image
              className={styles.dropIcon}
              src="drop.svg"
              alt="drop"
              width={64}
              height={64}
            /> */}
            <div className={styles.dragImage}></div>
            <h2>Drop your document here</h2>
            <p>Or click to browse &#11050; Supports PDF, DOC, TXT and more</p>
            {/* <input type="file" id="hhh" /> */}
            {/* <div className={styles.chooseFileButton}>
              <Image src="choosefile.svg" alt="drop" width={24} height={24} />
            </div> */}
          </div>
        ) : (
          <div
            className={styles.heroDivImage}
            onDragEnter={(e) => dragEnterHandler(e)}
            onDragLeave={(e) => dragLeaveHandler(e)}
            onDragOver={(e) => dragEnterHandler(e)}
            // onDrop={(e) => handleFileChange(e, 1)}
            onDrop={(e) => handleFileChange(e, true)}
            // onChange={(e) => handleFileChange(e, false)}
          >
            {/* <Image
              className={styles.heroImage}
              src="/AI.png"
              alt="Hero Image"
              width={892}
              height={348}
            /> */}
            {/* <div className={styles.heroBlurImage}></div> */}
            <UploadIcon
              width={65}
              height={64}
              strokeColor="var(--text-color-blue)"
              className={styles.my_upload_icon}
            />
            {/* <Image
              className={styles.dropIcon}
              src="drop.svg"
              alt="drop"
              width={64}
              height={64}
            /> */}
            <h2>Drop your document here</h2>
            <p>Or click to browse &#11050; Supports PDF, DOC, TXT and more</p>
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
                accept=".pdf,.txt,.doc,.docx,application/pdf,text/plain,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              />
            </label>
            {/* <div className={styles.chooseFileButton}>
              <Image src="choosefile.svg" alt="drop" width={24} height={24} />
            </div> */}
          </div>
        )}
      </div>
    </div>
  );
};
export default DropZone;
