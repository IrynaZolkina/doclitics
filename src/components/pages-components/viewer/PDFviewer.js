"use client";

// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.js`;

import { useState, useEffect } from "react";
// import { Document, Page } from "react-pdf";
import styles from "./css-modules/pdfviewer.module.css";
import { loadFileFromIndexedDb } from "@/lib/pdfutils";
// import dynamic from "next/dynamic";
//import { pdfjs } from "react-pdf";
// import pdfjsLib from "pdfjs-dist/legacy/build/pdf.js";
// import { DOMMatrix } from "canvas"; // npm install canvas
// global.DOMMatrix = DOMMatrix;
// import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.js";

// pdfjsLib.GlobalWorkerOptions.workerSrc =
// "//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";

// const PDFViewerComponent = dynamic(
//   async () => {
//     const mod = await import("react-pdf");
//     const { pdfjs, Document, Page } = mod;

//     // Use legacy build for Node.js-safe environment
//     pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

//     return {
//       default: function InnerPDFViewer(props) {
//         return (
//           <InnerPDFViewer
//             pdfjs={pdfjs}
//             Document={Document}
//             Page={Page}
//             {...props}
//           />
//         );
//       },
//     };
//   },
//   { ssr: false }
// );

export default function PDFViewer() {
  const [file, setFile] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [Document, setDocument] = useState(null);
  const [Page, setPage] = useState(null);

  // Load react-pdf components dynamically
  //   useEffect(() => {
  //     import("react-pdf").then((mod) => {
  //       const { Document, Page, pdfjs } = mod;
  //       pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js"; // legacy build
  //       setDocument(() => Document);
  //       setPage(() => Page);
  //     });
  //   }, []);
  // useEffect(() => {
  //   import("pdfjs-dist/build/pdf.worker.min.mjs").then((worker) => {
  //     pdfjs.GlobalWorkerOptions.workerSrc = URL.createObjectURL(
  //       new Blob([worker], { type: "application/javascript" })
  //     );
  //   });
  // }, []);

  useEffect(() => {
    const loadingTask = pdfjsLib.getDocument("/example.pdf");
    loadingTask.promise.then((pdf) => console.log(pdf.numPages));
  }, []);
  // Load PDF from IndexedDB
  useEffect(() => {
    loadFileFromIndexedDb().then((pdfFile) => {
      if (pdfFile) setFile(URL.createObjectURL(pdfFile));
    });
  }, []);

  if (!file || !Document || !Page) return <p>Loading PDF...</p>;

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  const nextPage = () => setPageNumber((p) => Math.min(p + 1, numPages));
  const prevPage = () => setPageNumber((p) => Math.max(p - 1, 1));
  const zoomIn = () => setScale((s) => s + 0.2);
  const zoomOut = () => setScale((s) => (s > 0.4 ? s - 0.2 : s));
  const resetZoom = () => setScale(1);
  return (
    <div className={styles.pdfContainer}>
      <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
        <Page pageNumber={pageNumber} scale={scale} />
      </Document>

      <div className={styles.controls}>
        <button onClick={prevPage} disabled={pageNumber <= 1}>
          ◀ Prev
        </button>
        <span>
          {pageNumber} / {numPages}
        </span>
        <button onClick={nextPage} disabled={pageNumber >= numPages}>
          Next ▶
        </button>

        <button onClick={zoomOut}>➖ Zoom Out</button>
        <button onClick={resetZoom}>🔄 Reset</button>
        <button onClick={zoomIn}>➕ Zoom In</button>
      </div>
    </div>
  );
}
