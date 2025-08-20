"use client";
import "../../globals.css";
import styles from "../../css-modules/viewerpage.module.css";
import { useEffect, useRef, useState } from "react";
import { getFileFromIndexedDB, deleteFileFromIndexedDB } from "@/lib/indexeddb";

import { useSelector, useDispatch } from "react-redux";

import * as pdfjsLib from "pdfjs-dist";
import Link from "next/link";
import Button from "@/components-ui/Button";
import Paper from "@/components-ui/svg-components/Paper";
import { formatBytes } from "@/lib/formatBytes";
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";

export default function ViewerPage() {
  const [pageUrl, setPageUrl] = useState(null);
  const [error, setError] = useState(null);
  const [scale, setScale] = useState(1.5);
  const [rotation, setRotation] = useState(0);
  const [arrayBuffer, setArrayBuffer] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [chosenFile, setChosenFile] = useState(null);
  const [extractedText, setExtractedTexts] = useState();
  const [pdfDoc, setPdfDoc] = useState(null);
  const [totalPages, setTotalPages] = useState(0);

  const [pageNum, setPageNum] = useState(1);

  const canvasRef = useRef(null);
  const dispatch = useDispatch();
  const fileName = useSelector((state) => state.file.fileName);
  const fileType = useSelector((state) => state.file.fileType);
  const fileSize = useSelector((state) => state.file.fileSize);

  useEffect(() => {
    if (pdfDoc) {
      renderPage(pageNum);
    }
  }, [pdfDoc, pageNum, scale, rotation, numPages, renderPage]);

  const renderPage = async (pageNumber) => {
    if (!pdfDoc) return;

    const page = await pdfDoc.getPage(pageNumber);
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // Apply rotation
    const viewport = page.getViewport({ scale, rotation: rotation });

    // Set canvas dimensions to match the viewport
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    // Render the PDF page
    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };

    await page.render(renderContext).promise;
  };

  const handleZoomIn = async () => {
    const newScale = scale + 0.2;
    setScale(newScale);
    await renderPage(arrayBuffer, currentPage, newScale, rotation);
  };

  const handleZoomOut = async () => {
    const newScale = Math.max(0.5, scale - 0.2);
    setScale(newScale);
    await renderPage(arrayBuffer, currentPage, newScale, rotation);
  };

  const handleRotate = async () => {
    const newRotation = (rotation + 90) % 360;
    setRotation(newRotation);
    await renderPage(arrayBuffer, currentPage, scale, newRotation);
  };

  const handlePrevPage = async () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      await renderPage(arrayBuffer, newPage, scale, rotation);
    }
  };

  const goToPrevPage = () => {
    if (pageNum > 1) {
      setPageNum((prevPageNum) => prevPageNum - 1);
    }
  };

  const goToNextPage = () => {
    if (pageNum < totalPages) {
      setPageNum((prevPageNum) => prevPageNum + 1);
    }
  };

  // Zoom functions
  const zoomIn = () => {
    setScale((prevScale) => Math.min(prevScale + 0.2, 3));
  };

  const zoomOut = () => {
    setScale((prevScale) => Math.max(prevScale - 0.2, 0.5));
  };

  // Rotation functions
  const rotateClockwise = () => {
    setRotation((prevRotation) => (prevRotation + 90) % 360);
  };

  const rotateCounterClockwise = () => {
    setRotation((prevRotation) => (prevRotation - 90 + 360) % 360);
  };
  const handleNextPage = async () => {
    if (currentPage < numPages) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      await renderPage(arrayBuffer, newPage, scale, rotation);
    }
  };
  const filePreposition = async () => {
    try {
      const file = await getFileFromIndexedDB("current-pdf");
      console.log("File name from IndexedDB:-------", file.name);
      await deleteFileFromIndexedDB("current-pdf");
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
      //read
    } catch (error) {
      console.error("Error getting file from IndexedDB:", error);
    }
  };

  // if (error) return <p style={{ color: "red" }}>{error}</p>;
  // if (!pageUrl) return <p>Загрузка PDF...</p>;
  // filePreposition();
  return (
    <div className={styles.viewerPage}>
      <div
        className="navButtonContainer"
        style={{ width: "96px", height: "36px" }}
      >
        <Link href="/">
          <button className="navButton">Home Page</button>
        </Link>
      </div>
      <h1>Ready to Summarize Smarter?</h1>
      <p>
        Choose your style, and let our AI do the heavy lifting. You can explore
        the options below{" "}
      </p>
      <p>
        to see how summaries are customized — when you’re ready to generate your
        first one,
      </p>
      <p>simply create a free account to unlock the magic.</p>

      {/* <div style={{ marginBottom: 20 }}>
        <button onClick={handleZoomIn}>➕ Увеличить</button>
        <button onClick={handleZoomOut}>➖ Уменьшить</button>
        <button onClick={handleRotate}>↻ Повернуть</button>
      </div>

      <div style={{ marginBottom: 20 }}>
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          ◀️ Назад
        </button>
        <span style={{ margin: "0 10px" }}>
          Страница {currentPage} из {numPages}
        </span>
        <button onClick={handleNextPage} disabled={currentPage === numPages}>
          Вперёд ▶️
        </button>
      </div>

      <div>
        <img src={pageUrl} alt={`Страница ${currentPage}`} />
      </div> */}

      <div className={styles.pageWrapper}>
        <div className={styles.pageContainer}>
          <h2>Selected File:</h2>
          <div className={styles.blockContainer}>
            <div>
              {" "}
              <Paper />
            </div>
            <div>{fileName}</div>
            <div className={styles.block}>
              {fileSize > 0 ? formatBytes(fileSize) : ""}
            </div>
            <div className={styles.block}>.{fileType}</div>
            <div>
              <Button
                onClick={filePreposition}
                bg={"rgba(60, 131, 246, 0.05)"}
                borderColor={"rgba(85, 147, 247, 0.3)"}
                height={"55px"}
                width={"151px"}
                radius={"13px"}
              >
                <span className={styles.preview}>Preview</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.controlsContainer}>
        <div className={styles.pageControls}>
          <button onClick={goToPrevPage} disabled={pageNum <= 1}>
            Previous
          </button>
          <span>
            Page {pageNum} of {totalPages}
          </span>
          <button onClick={goToNextPage} disabled={pageNum >= totalPages}>
            Next
          </button>
        </div>

        <div className={styles.pdfContainer}>
          {/* {console.log("pdf-doc---", pdfDoc)} */}
          <canvas ref={canvasRef} />
        </div>
        <div className={styles.zoomControls}>
          <button onClick={zoomOut}>Zoom Out</button>
          <span>{Math.round(scale * 100)}%</span>
          <button onClick={zoomIn}>Zoom In</button>
        </div>

        <div className={styles.rotationControls}>
          <button onClick={rotateCounterClockwise}>Rotate Left</button>
          <button onClick={rotateClockwise}>Rotate Right</button>
        </div>
        <div className={styles.container}>
          <Button>hello</Button>
        </div>
      </div>
    </div>
  );
}
