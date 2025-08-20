"use client";

import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function PdfViewer({ file }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <div>
      <div style={{ marginBottom: 10 }}>
        <button onClick={() => setPageNumber((p) => Math.max(p - 1, 1))}>
          Prev
        </button>
        <button onClick={() => setPageNumber((p) => Math.min(p + 1, numPages))}>
          Next
        </button>
        <button onClick={() => setScale((s) => s + 0.25)}>Zoom +</button>
        <button onClick={() => setScale((s) => Math.max(s - 0.25, 0.25))}>
          Zoom -
        </button>
        <span>
          {" "}
          Page {pageNumber} / {numPages}{" "}
        </span>
      </div>

      <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
        <Page pageNumber={pageNumber} scale={scale} />
      </Document>
    </div>
  );
}
