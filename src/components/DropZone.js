import "../app/globals.css";
import styles from "./css-modules/dropzone.module.css";

import Image from "next/image";
import { useState } from "react";

import * as pdfjsLib from "pdfjs-dist";
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";

const DropZone = ({
  setChosenFile,
  setPdfDoc,
  setTotalPages,
  setExtractedTexts,
}) => {
  const [drag, setDrag] = useState(false);

  // **********

  const dragStartHandler = (e) => {
    e.preventDefault();
    setDrag(true);
  };
  const dragLeaveHandler = (e) => {
    e.preventDefault();
    setDrag(false);
  };

  const handleFileChange = (event, vart) => {
    let file;
    if (vart === 1) {
      event.preventDefault();
      console.log("---VART---", vart, "*****");
      let files = [...event.dataTransfer.files];
      file = files[0];
      console.log("---files-2---", file, "*****");
      console.log("---files[0].name---", files[0].name, "*****");
      setDrag(false);
    } else {
      //event.preventDefault();
      file = event.target.files[0];
      console.log("file", file);
    }

    if (!file || file.type !== "application/pdf") {
      alert("Please select a valid PDF file");
      return;
    }
    setChosenFile(file);
    const reader = new FileReader();
    reader.readAsArrayBuffer(file); // ***  !!!!
    reader.onload = async (e) => {
      const typedArray = new Uint8Array(e.target.result);
      try {
        const loadingTask = pdfjsLib.getDocument(typedArray);
        const pdf = await loadingTask.promise;
        console.log("pdf=========", pdf);
        setPdfDoc(pdf);
        setTotalPages(pdf.numPages);
        //     setPageNum(1);
        let fullText = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          fullText += textContent.items.map((item) => item.str).join(" ");
        }

        setExtractedTexts(fullText);
      } catch (error) {
        console.error("Error loading PDF:", error);
        alert("Error loading PDF file");
      }
    };
    //reader.readAsArrayBuffer(file);
  };
  return (
    <div>
      <div>
        {drag ? (
          <div
            className={styles.heroDivImage}
            onDragStart={(e) => dragStartHandler(e)}
            onDragLeave={(e) => dragLeaveHandler(e)}
            onDragOver={(e) => dragStartHandler(e)}
            onDrop={(e) => handleFileChange(e, 1)}
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

            <input
              type="file"
              //ref={fileInputRef}
              onChange={handleFileChange}
              accept="application/pdf"
              //accept=".doc,application/msword,application/pdf"
            />
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
