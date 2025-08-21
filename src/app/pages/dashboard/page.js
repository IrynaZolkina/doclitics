"use client";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
// import { Document, Page, pdfjs } from "react-pdf";
import { useEffect, useState } from "react";
// import dynamic from "next/dynamic";
import { deleteFileFromIndexedDb, loadFileFromIndexedDb } from "@/lib/pdfutils";
import { addToast } from "@/redux/store";
import Dashboard from "@/components/Dashboard";

// import "../app/globals.css";
import styles from "../css-modules/dashboard.module.css";

// import * as pdfjsLib from "pdfjs-dist";
// pdfjsLib.GlobalWorkerOptions.workerSrc =
//   "//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";

const DashboardPage = () => {
  const storePdfDoc = useSelector((state) => state.file.pdfBase64);
  //   const storePdfDoc = useSelector((state) => state.file.pdfBase64);
  // const [numPages, setNumPages] = useState(null);

  const dispatch = useDispatch();

  const [file, setFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);

  useEffect(() => {
    loadFileFromIndexedDb().then((pdfFile) => {
      if (pdfFile) setFile(pdfFile);
    });
  }, []);
  // useEffect(() => {
  //   if (pdfDoc && pdfD) {
  //     renderPage(pageNum);
  //   }
  // }, [pdfDoc, pdfD, pageNum, scale, rotation]);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1);
  }
  const nextPage = () =>
    setPageNumber((prev) => (prev < numPages ? prev + 1 : prev));
  const prevPage = () => setPageNumber((prev) => (prev > 1 ? prev - 1 : prev));

  const zoomIn = () => setScale((prev) => prev + 0.2);
  const zoomOut = () => setScale((prev) => (prev > 0.4 ? prev - 0.2 : prev));

  const renderPage = async (pageNumber) => {
    if (!pdfDoc) return;

    // const page = await pdfDoc.getPage(pageNumber);
    // const canvas = canvasRef.current;
    // const context = canvas.getContext("2d");

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

  // const goToPrevPage = () => {
  //   if (pageNum > 1) {
  //     setPageNum((prevPageNum) => prevPageNum - 1);
  //   }
  // };

  // const goToNextPage = () => {
  //   if (pageNum < totalPages) {
  //     setPageNum((prevPageNum) => prevPageNum + 1);
  //   }
  // };

  // Rotation functions
  const rotateClockwise = () => {
    setRotation((prevRotation) => (prevRotation + 90) % 360);
  };

  const rotateCounterClockwise = () => {
    setRotation((prevRotation) => (prevRotation - 90 + 360) % 360);
  };

  async function openPDF() {
    try {
      const file = await loadFileFromIndexedDb();
      if (file) {
        const url = URL.createObjectURL(file);
        // window.open(url, "_blank");
        await deleteFileFromIndexedDb("myPDF");
        dispatch(
          addToast({
            id: Date.now(),
            type: "info",
            message: "PDF opened and deleted",
          })
        );
      } else {
        dispatch(
          addToast({ id: Date.now(), type: "error", message: "File not found" })
        );
      }
    } catch (err) {
      dispatch(addToast({ id: Date.now(), type: "error", message: err }));
    }
  }

  if (!file) return <p>No PDF found</p>;
  return (
    <div style={{ color: "white" }}>
      <div className={styles.viewerWrapper}>
        <div className={styles.controls}>
          <button onClick={prevPage} disabled={pageNumber <= 1}>
            ◀ Prev
          </button>
          <span>
            Page {pageNumber} / {numPages}
          </span>
          <button onClick={nextPage} disabled={pageNumber >= numPages}>
            Next ▶
          </button>
          <button onClick={zoomOut}>➖ Zoom Out</button>
          <button onClick={zoomIn}>➕ Zoom In</button>
        </div>

        <div className={styles.pdfContainer}>
          {/* <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
            <Page pageNumber={pageNumber} scale={scale} />
          </Document> */}
        </div>
      </div>

      <h1>PDF Viewer</h1>
      <h1>PDF Viewer</h1>
      <h1>PDF Viewer</h1>
      <h1>PDF Viewer</h1>
      <h1>PDF Viewer</h1>
      {/* <Dashboard /> */}
      {/* <button onClick={openPDF} style={{ color: "white" }}>
        OPEN AND DELETE
      </button> */}
    </div>
  );
};
export default DashboardPage;
