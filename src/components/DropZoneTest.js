"use client";
import "../app/globals.css";
import styles from "./css-modules/dropzone.module.css";

import { useDispatch } from "react-redux";
import { useState } from "react";
import { useRouter } from "next/navigation";
//import fs from "fs";

import Image from "next/image";
//import { savePdfToDb } from "@/lib/db";
import * as pdfjsLib from "pdfjs-dist";
import { setFileData } from "@/redux/store";
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";

const DropZoneTest = ({
  setChosenFile,
  setPdfDoc,
  setTotalPages,
  setExtractedTexts,
}) => {
  const [drag, setDrag] = useState(false);
  const [file, setFile] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  // **********

  const dragStartHandler = (e) => {
    e.preventDefault();
    setDrag(true);
  };
  const dragLeaveHandler = (e) => {
    e.preventDefault();
    setDrag(false);
  };

  const handleFileChange = async (event, dragIndicator) => {
    let filel;
    if (dragIndicator === 1) {
      event.preventDefault();
      let files = [...event.dataTransfer.files];
      filel = files[0];
      console.log("---files-2---", filel, "*****");
      console.log("---files[0].name---", files[0].name, "*****");
      setDrag(false);
    } else {
      //event.preventDefault();
      filel = event.target.files[0];
      console.log("file", filel);
    }

    if (!filel || filel.type !== "application/pdf") {
      alert("Please select a valid PDF file");
      return;
    }
    setChosenFile(filel);
    setFile(filel);
    const formData = new FormData();
    formData.append("file", filel);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    alert(JSON.stringify(data));
    console.log("---------------------------", data);
    console.log("---------------------------", data.fileSaved);
    console.log("---------------------------", data.fileSaved.insertedId);
    dispatch(setFileData({ idSavedFileToMongo: data.fileSaved.insertedId }));
    //console.log("---pdfBuffer---", pdfBuffer, "------*****");
    // savePdfToDb(file);
    const reader = new FileReader();
    reader.readAsArrayBuffer(filel); // ***  !!!!
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
              src="ai.png"
              width={892}
              height={348}
              alt="AI Image"
              priority={true} // ✅ important for LCP
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
export default DropZoneTest;
