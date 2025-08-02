import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import styles from "./css-modules/dropzone.module.css";
import Image from "next/image";

const DropZone = () => {
  const [files, setFiles] = useState([]);
  const [drag, setDrag] = useState(false);

  const dragStartHandler = (e) => {
    e.preventDefault();
    setDrag(true);
  };
  const dragLeaveHandler = (e) => {
    e.preventDefault();
    setDrag(false);
  };
  const onDropHandler = (e) => {
    e.preventDefault();
    let files = [...e.dataTransfer.files];
    console.log("files---", files[0].name);
    setDrag(false);
  };

  const onDrop = useCallback((acceptedFiles) => {
    console.log("hello");
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div>
      <div>
        {drag ? (
          <div
            className={styles.heroDivImage}
            onDragStart={(e) => dragStartHandler(e)}
            onDragLeave={(e) => dragLeaveHandler(e)}
            onDragOver={(e) => dragStartHandler(e)}
            onDrop={(e) => onDropHandler(e)}
          >
            <Image
              className={styles.heroImage}
              src="aiimage.svg"
              alt="Hero Image"
              width={892}
              height={348}
            />
            <Image
              className={styles.dropIcon}
              src="drop.svg"
              alt="drop"
              width={64}
              height={64}
            />
            <div className={styles.dragImage}></div>
            <h2>Drop your document here</h2>
            <p>Or click to browse &#11050; Supports PDF, DOC, TXT and more</p>
            <input type="file" id="hhh" />
            <div className={styles.chooseFileButton}>
              <Image src="choosefile.svg" alt="drop" width={24} height={24} />
            </div>
            {console.log("Helloooooo")}
          </div>
        ) : (
          <div
            className={styles.heroDivImage}
            onDragStart={(e) => dragStartHandler(e)}
            onDragLeave={(e) => dragLeaveHandler(e)}
            onDragOver={(e) => dragStartHandler(e)}
          >
            <Image
              className={styles.heroImage}
              src="aiimage.svg"
              alt="Hero Image"
              width={892}
              height={348}
            />
            <div className={styles.heroBlurImage}></div>
            <Image
              className={styles.dropIcon}
              src="drop.svg"
              alt="drop"
              width={64}
              height={64}
            />
            <h2>Drop your document here</h2>
            <p>Or click to browse &#11050; Supports PDF, DOC, TXT and more</p>
            <input type="file" id="hhh" />
            <div className={styles.chooseFileButton}>
              <Image src="choosefile.svg" alt="drop" width={24} height={24} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DropZone;
