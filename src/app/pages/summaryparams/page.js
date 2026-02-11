"use client";
import "../../globals.css";
import styles from "./summary-params.module.css";

import Link from "next/link";

import * as pdfjsLib from "pdfjs-dist";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { getFileFromIndexedDB, deleteFileFromIndexedDB } from "@/lib/indexeddb";
import { promptMd } from "@/components/pages-components/summary/promptMd";
import {
  setDocsAmount,
  setFileData,
  setLastPage,
  setSummary,
} from "@/redux/store";
import { apiFetch } from "@/lib/apiFetch";
import PopupLogin, { showLoginPopup } from "@/components/auth/login/PopupLogin";

import { toastSuperFunctionJS } from "@/components-ui/toasts/toastSuperFunctionJS";

import { documentTypes, documentTones } from "./documentOptions";
import { usePdfViewer } from "@/hooks/usePdfViewer";
import { PdfViewer } from "@/components/pages-components/summary-params/pdfviewer/PdfViewer";

import SelectedFileCard from "@/components/pages-components/summary-params/SelectedFileCard/SelectedFileCard";
import DocumentTypeSelector from "@/components/pages-components/summary-params/DocumentTypeSelector/DocumentTypeSelector";
import SummaryToneSelector from "@/components/pages-components/summary-params/SummaryToneSelector/SummaryToneSelector";
import SummarySizeDepth from "@/components/pages-components/summary-params/SummarySizeDepth/SummarySizeDepth";
import AdditionalInstructions from "@/components/pages-components/summary-params/AdditionalInstructions/AdditionalInstructions";
import SummaryActionBar from "@/components/pages-components/summary-params/SummaryActionBar/SummaryActionBar";

function countWords(str) {
  return str.split(/[ \t\n]+/).filter(Boolean).length;
}

export default function SummaryParams() {
  const [showPopup, setShowPopup] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Combined state
  const [viewerState, setViewerState] = useState({
    openViewer: false,
    chosenFile: null,
    fileMeta: { name: "", type: "", size: 0 },
    inputAdditional: "",
    activeIndexType: 0,
    activeIndexTone: 3,
    activeIndexSize: 0,
    value: 800,
    pageNum: 1,
  });

  // const canvasRef = useRef(null);
  const dispatch = useDispatch();
  const router = useRouter();
  const formattedPrompt = useSelector((state) => state.file.formattedPrompt);
  // const userName = useSelector((state) => state.userNameSlice.username);
  const user = useSelector((state) => state.user);
  const docsAmount = useSelector((state) => state.user.docsAmount);
  const currentFileMeta = useSelector((state) => state.currentFileMeta);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // const isLoginParam = searchParams.get("login") === "1";
  const isLoginOpen = searchParams.get("login") === "1";

  const sendingRef = useRef(false);

  const updateQuery = useCallback(
    (key, value) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value === null) params.delete(key);
      else params.set(key, value);

      router.replace(params.toString() ? `${pathname}?${params}` : pathname, {
        scroll: false,
      });
    },
    [searchParams, pathname, router],
  );

  const viewer = usePdfViewer(false);
  useEffect(() => {
    if (viewerState.chosenFile) {
      viewer.loadPdfFromFile(viewerState.chosenFile);
    }
  }, [viewerState.chosenFile]);

  useEffect(() => {
    const saved = localStorage.getItem("myData");
    if (saved) {
      const { activeIndexType, activeIndexTone, value } = JSON.parse(saved);
      console.log("Restored:", activeIndexType, activeIndexTone, value);

      // Restore into viewerState
      setViewerState((prev) => ({
        ...prev,
        activeIndexType,
        activeIndexTone,
        value,
      }));
      localStorage.removeItem("myData");
    }

    (async () => {
      try {
        const file = await getFileFromIndexedDB("current-pdf");
        if (!file) {
          router.push("/");
          return;
        }
        console.log("File name from IndexedDB:-------", file.name);

        setViewerState((prev) => ({
          ...prev,
          chosenFile: file,
          fileMeta: { name: file.name, type: file.type, size: file.size },
        }));
      } catch (error) {
        console.error("Error getting file from IndexedDB:", error);
      }
    })();
  }, []);

  const extractPdfText = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const typedArray = new Uint8Array(arrayBuffer);
    const loadingTask = pdfjsLib.getDocument(typedArray);
    const pdf = await loadingTask.promise;

    let fullText = "";

    const MAX_PAGES = 30;
    for (let i = 1; i <= Math.min(pdf.numPages, MAX_PAGES); i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      fullText += textContent.items.map((item) => item.str).join(" ");
    }
    return fullText;
  };

  const sendFile = async () => {
    if (sendingRef.current) return; // ✅ hard lock

    if (isGenerating) return; // ✅ block double click

    sendingRef.current = true;
    setIsGenerating(true);

    try {
      console.log("/////    user   //////. ", user);
      if (user.isAuthenticated === false) {
        console.log("No user found, redirecting to login.");
        // localStorage.setItem("lastPage", "/pages/viewer");
        // dispatch(setLastPage("/pages/viewer"));
        toastSuperFunctionJS("Please, sign in", "warning");
        localStorage.setItem(
          "myData",
          JSON.stringify({
            activeIndexType: viewerState.activeIndexType,
            activeIndexTone: viewerState.activeIndexTone,
            value: viewerState.value,
          }),
        );
        updateQuery("login", "1");
        return; // ✅ important
        // setOpenPopupLogin(true);
        // return;
      }
      if (!viewerState.chosenFile) {
        toastSuperFunctionJS("No file found. Please upload again.", "error");
        router.push("/");
        return;
      }

      // Optional: limit pages to avoid UI freeze
      const extractedText = await extractPdfText(viewerState.chosenFile);

      const inputPrompt = promptMd[viewerState.activeIndexType].prompt;
      // const inputPrompt = promptMd[researchType].prompt;
      // console.log("/////    inputPrompt.   //////. ", inputPrompt);
      const TONE = documentTones[viewerState.activeIndexTone];
      const WORDCOUNT = viewerState.value;
      console.log("/////    TONE.   //////. ", TONE);
      console.log("/////    WORDCOUNT.   //////. ", WORDCOUNT);
      const formattedPrompt = inputPrompt
        .replace("{TONE}", TONE)
        .replace("{WORD COUNT}", WORDCOUNT);
      // console.log("/////    formattedPrompt.   //////. ", formattedPrompt);
      // dispatch(
      //   setFileData({
      //     formattedPrompt: formattedPrompt,
      //   })
      // );
      const additionalNotes = viewerState.inputAdditional.trim();

      const fileName = viewerState.fileMeta?.name || "Unknown";
      const fileType = viewerState.fileMeta?.type || "unknown";
      const fileSize = viewerState.fileMeta?.size
        ? `${viewerState.fileMeta.size} bytes`
        : "unknown";

      const docContext = `Document context:
- File name: ${fileName}
- File type: ${fileType}
- File size: ${fileSize}
- Target tone: ${TONE}
- Target length: ~${WORDCOUNT} words`;

      const finalPrompt = `${docContext}

${formattedPrompt}${
        additionalNotes
          ? `

User preferences (lower priority than the instructions above):
"""
${additionalNotes}
""" `
          : ""
      }`;
      // const response = await fetch("/api/chat", {
      // setLoading(true);
      // console.log("/////    Uername   //////. ", userName);
      // router.replace("/pages/summary");
      // dispatch(setSummary(""));

      // const reqId =
      //   crypto?.randomUUID?.() ??
      //   `${Date.now()}-${Math.random().toString(16).slice(2)}`;

      router.replace("/pages/summary");
      // console.log("SEND /api/chat reqId:", reqId);
      const response = await apiFetch("/api/chat", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: extractedText,
          prompt: formattedPrompt, //finalPrompt,
        }),
      });
      // setIsLoading(false);
      // setLoading(false);
      //await deleteFileFromIndexedDB("current-pdf");
      if (!response) {
        toastSuperFunctionJS("Request failed. Please try again.", "error");
        return;
      }

      const result = await response.json();

      const docsAmount =
        result?.data?.docsAmount ?? result?.error?.details?.docsAmount;

      if (typeof docsAmount === "number") {
        dispatch(setDocsAmount(docsAmount));
      }

      if (!response.ok) {
        toastSuperFunctionJS(
          result?.error?.message || "Request failed",
          "error",
        );
        return;
      }

      // result = { success, message, data: { text } }
      const text = result?.data?.text ?? "";

      console.log("Summary text:", text);

      dispatch(setSummary(text));
      dispatch(
        setFileData({
          type: documentTypes[viewerState.activeIndexType].title,
          style: "",
          depth: WORDCOUNT,
          tone: TONE,
          // or actual base64 string if you generate it
        }),
      );
      const result1 = await deleteFileFromIndexedDB("current-pdf");

      if (result1.success) {
        console.log("File deleted!");
      } else {
        console.error("Delete failed:", result1.error);
      }
      // ✅ only now navigate
    } finally {
      setIsGenerating(false); // ✅ always reset
      sendingRef.current = false; // ✅ release lock
    }
  };
  // if (isGenerating) {
  //   return <GeneratingScreen />;
  // }
  return (
    <div className={styles.viewerPageContainer}>
      {isLoginOpen && <PopupLogin onClose={() => updateQuery("login", null)} />}

      {/* <div
        className="navButtonContainer"
        style={{ width: "96px", height: "36px" }}
      >
        <Link href="/">
          <button className="navButton">Home Page</button>
        </Link>
      </div> */}
      <h1>Let’s Summarize This File 🚀</h1>
      <p>
        Choose your document type, style, and depth — our AI will do the rest.
      </p>

      <div className={styles.pageContainer}>
        <SelectedFileCard
          fileMeta={viewerState.fileMeta}
          openViewer={viewerState.openViewer}
          onToggle={() => {
            const newOpen = !viewerState.openViewer;
            setViewerState((prev) => ({ ...prev, openViewer: newOpen }));
            if (newOpen) viewer.openViewer();
            else viewer.closeViewer();
          }}
        />

        <PdfViewer viewer={viewer} />
        <DocumentTypeSelector
          documentTypes={documentTypes}
          activeIndexType={viewerState.activeIndexType}
          onChange={(index) =>
            setViewerState((prev) => ({ ...prev, activeIndexType: index }))
          }
        />
        <SummaryToneSelector
          tones={documentTones}
          activeIndexTone={viewerState.activeIndexTone}
          onChange={(index) =>
            setViewerState((prev) => ({ ...prev, activeIndexTone: index }))
          }
        />
        <SummarySizeDepth
          value={viewerState.value}
          onChange={(newValue) =>
            setViewerState((prev) => ({ ...prev, value: newValue }))
          }
        />
        <AdditionalInstructions
          value={viewerState.inputAdditional}
          onChange={(text) =>
            setViewerState((prev) => ({ ...prev, inputAdditional: text }))
          }
        />
      </div>
      <SummaryActionBar
        docsLeft={docsAmount}
        isGenerating={isGenerating}
        onGenerate={sendFile}
      />
    </div>
  );
}
