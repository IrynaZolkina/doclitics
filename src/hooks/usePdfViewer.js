"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export function usePdfViewer(initialOpen = true) {
  const canvasRef = useRef(null);
  const renderTaskRef = useRef(null);
  const lastFileRef = useRef(null);

  const [pdfDoc, setPdfDoc] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [open, setOpen] = useState(initialOpen); // ✅ use initialOpen
  const [scale, setScale] = useState(1.2);

  const MIN_ZOOM = 0.5;
  const MAX_ZOOM = 3;
  const ZOOM_STEP = 0.2;

  /* ========================
     ZOOM CONTROLS
  ========================= */

  const zoomIn = () => {
    setScale((s) => Math.min(MAX_ZOOM, +(s + ZOOM_STEP).toFixed(2)));
  };

  const zoomOut = () => {
    setScale((s) => Math.max(MIN_ZOOM, +(s - ZOOM_STEP).toFixed(2)));
  };

  const resetZoom = () => {
    setScale(1.2);
  };

  /* ========================
     RENDER PAGE
  ========================= */

  const renderPage = useCallback(async () => {
    if (!pdfDoc || !canvasRef.current) return;

    if (renderTaskRef.current) {
      renderTaskRef.current.cancel();
      renderTaskRef.current = null;
    }

    const pageObj = await pdfDoc.getPage(page);
    const viewport = pageObj.getViewport({
      scale,
      rotation,
    });

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    const renderTask = pageObj.render({
      canvasContext: ctx,
      viewport,
    });

    renderTaskRef.current = renderTask;

    try {
      await renderTask.promise;
    } catch (err) {
      if (err?.name !== "RenderingCancelledException") {
        console.error("PDF render error:", err);
      }
    }
  }, [pdfDoc, page, rotation, scale]);

  /* ========================
     AUTO-RENDER
  ========================= */

  useEffect(() => {
    if (open) renderPage();
  }, [renderPage, open]);

  /* ========================
     LOAD PDF
  ========================= */

  const loadPdfFromFile = async (file) => {
    if (!file) return;

    if (lastFileRef.current === file) return;
    lastFileRef.current = file;

    const buffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(new Uint8Array(buffer)).promise;

    setPdfDoc(pdf);
    setTotalPages(pdf.numPages);
    setPage(1);
  };

  /* ========================
     PUBLIC API
  ========================= */

  return {
    canvasRef,
    page,
    totalPages,
    open,
    scale,

    setPage,
    toggleOpen: () => setOpen((v) => !v),
    openViewer: () => setOpen(true),
    closeViewer: () => setOpen(false),

    zoomIn,
    zoomOut,
    resetZoom,

    rotateCW: () => setRotation((r) => (r + 90) % 360),
    rotateCCW: () => setRotation((r) => (r - 90 + 360) % 360),

    loadPdfFromFile,
  };
}
