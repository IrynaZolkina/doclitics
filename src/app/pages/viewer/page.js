"use client";
import "../../globals.css";
import styles from "../css-modules/viewerpage.module.css";

import ReactMarkdown from "react-markdown";
import * as pdfjsLib from "pdfjs-dist";
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";

import Button from "@/components-ui/Button";
import Paper from "@/components-ui/svg-components/Paper";
import { formatBytes } from "@/lib/formatBytes";
import { getFileFromIndexedDB, deleteFileFromIndexedDB } from "@/lib/indexeddb";
import Eye1 from "@/components-ui/svg-components/Eye1";
import EyeOff1 from "@/components-ui/svg-components/EyeOff1";
import SliderRange from "../../../components-ui/SliderRange";
import { promptMd } from "@/lib/promptMd";
import { setFileData, setLastPage, setSummary } from "@/redux/store";
import Popup from "@/components-ui/Popup";
import { useRouter } from "next/navigation";
import Arrowleft from "./Arrowleft";
import { apiFetch } from "@/utils/apiFetch";
import { toastSuperFunctionJS } from "@/components-ui/toastSuperFunctionJS";
import { showLoginPopup } from "@/components/PopupLogin";
import PopupLoginInner from "@/components/PopupLoginInner";
import IndeterminateProgressBar from "@/components-ui/IndeterminateProgressBar";

import PulseIndicator from "@/components-ui/PulseIndicator";
import { Spinnaker } from "next/font/google";
import Arrowright from "./Arrowright";
import ArrRight from "./ArrRight";
import ArrLeft from "./ArrLeft";
import FourStar from "./FourStar";
import FlexibleButton from "@/components-ui/FlexibleButton";
import TestButton from "@/components-ui/TestButton";

export default function ViewerPage() {
  const [pageUrl, setPageUrl] = useState(null);
  const [error, setError] = useState(null);
  const [scale, setScale] = useState(1.5);
  const [rotation, setRotation] = useState(0);
  const [arrayBuffer, setArrayBuffer] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [openViewer, setOpenViewer] = useState(true);

  const [chosenFile, setChosenFile] = useState(null);
  // const [extractedText, setExtractedTexts] = useState();
  const [pdfDoc, setPdfDoc] = useState(null);
  const [totalPages, setTotalPages] = useState(0);

  const [pageNum, setPageNum] = useState(1);
  const [activeIndexType, setActiveIndexType] = useState(0);
  const [activeIndexTone, setActiveIndexTone] = useState(3);
  const [activeIndexSize, setActiveIndexSize] = useState(0);
  const [inputAdditional, setInputAdditional] = useState("");
  const [researchType, setResearchType] = useState(0);

  const [value, setValue] = useState(800);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [choices, setChoices] = useState([]);

  const [showPopup, setShowPopup] = useState(false);
  const [openPopupLogin, setOpenPopupLogin] = useState(false);

  const canvasRef = useRef(null);
  const dispatch = useDispatch();
  const formattedPrompt = useSelector((state) => state.file.formattedPrompt);
  const userName = useSelector((state) => state.userNameSlice.username);
  const router = useRouter();
  console.log("chosenFile---", chosenFile, typeof chosenFile, "*****");
  const currentFileMeta = useSelector((state) => state.currentFileMeta);

  // console.log("fileName--", fileName);
  // console.log("fileType--", fileType);
  // console.log("fulltext--", extractedText);
  //let fileName,fileType,fileSize
  const [fileMeta, setFileMeta] = useState({
    name: "",
    type: "",
    size: 0,
  });
  const documentTypes = [
    // Order is crucial, must match promptMd keys NUMBERS!!!
    {
      emoji: "📊",
      title: "Report",
      par: "Business reports, summaries, and formal write-ups.",
    },
    {
      emoji: "🔬",
      title: "Research",
      par: "Academic studies, scientific papers, or citations",
    },
    {
      emoji: "📕",
      title: "Literature",
      par: "Meeting notes, memos, essays, or reflective writing.",
    },
    {
      emoji: "️📑",
      title: "Resume",
      par: "Professional profiles, portfolios, or CV documents",
    },
    {
      emoji: "️📰",
      title: "Meeting Transcript",
      par: "Conversations, interviews, or collaborative discussions",
    },
    {
      emoji: "🧬",
      title: "Conceptual",
      par: "Abstract, theoretical, or documents with conceptual topics. ",
    },
    {
      emoji: "📃",
      title: "Other",
      par: "Any document that doesn’t fit the above types",
    },
  ];

  const documentTones = [
    "Neutral",
    "Formal",
    "Casual",
    "Academic",
    "Friendly",
    "Persuasive",
  ];
  const documentSize = ["Normal", "Advanced "];

  // useEffect(() => {
  //   setResearchType(activeIndexType);
  // }, [activeIndexType]);

  const renderPage = useCallback(
    async (pageNumber) => {
      if (!pdfDoc) return;

      const page = await pdfDoc.getPage(pageNumber);
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      /* insert here */
      const container = canvas.parentElement;
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;

      let viewport = page.getViewport({ scale: 1, rotation });

      const scaleX = containerWidth / viewport.width;
      const scaleY = containerHeight / viewport.height;
      const newScale = Math.min(scaleX, scaleY);

      /* insert here */

      // Apply rotation
      /* */
      viewport = page.getViewport({ scale: newScale, rotation });
      // const viewport = page.getViewport({ scale, rotation });

      // Set canvas dimensions to match the viewport
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      // Render the PDF page
      const renderContext = {
        canvasContext: context,
        viewport,
      };

      await page.render(renderContext).promise;
    },
    [pdfDoc, rotation], // dependencies
  );

  useEffect(() => {
    if (!openViewer) {
      if (pdfDoc) {
        renderPage(pageNum);
      }
    }
  }, [pdfDoc, pageNum, renderPage, openViewer, scale]);

  // useEffect(() => {
  //   if (formattedPrompt) {
  //     console.log("----formattedPrompt----", formattedPrompt);
  //   }
  // }, [formattedPrompt]);
  useEffect(() => {
    const saved = localStorage.getItem("myData");
    if (saved) {
      const { activeIndexType, activeIndexTone, value } = JSON.parse(saved);
      console.log("Restored:", activeIndexType, activeIndexTone, value);

      // Optionally, put them back into state
      setActiveIndexType(activeIndexType);
      setActiveIndexTone(activeIndexTone);
      setValue(value);
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
        console.log("chosenFile:-------", chosenFile);
        setFileMeta({
          name: file.name,
          type: file.type,
          size: file.size,
        });
        setChosenFile(file);

        // render PDF with pdfjsLib
        const arrayBuffer = await file.arrayBuffer();
        const typedArray = new Uint8Array(arrayBuffer);
        const loadingTask = pdfjsLib.getDocument(typedArray);
        const pdf = await loadingTask.promise;

        setPdfDoc(pdf);
        setTotalPages(pdf.numPages);
      } catch (error) {
        console.error("Error getting file from IndexedDB:", error);
      }
    })();
  }, [chosenFile, router]);

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

    // renderPage(currentPage);
  };

  const rotateCounterClockwise = () => {
    setRotation((prevRotation) => (prevRotation - 90 + 360) % 360);
    // renderPage(numPages);
  };
  // const handleNextPage = async () => {
  //   if (currentPage < numPages) {
  //     const newPage = currentPage + 1;
  //     setCurrentPage(newPage);
  //     await renderPage(arrayBuffer, newPage, scale, rotation);
  //   }
  // };
  const extractPdfText = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const typedArray = new Uint8Array(arrayBuffer);
    const loadingTask = pdfjsLib.getDocument(typedArray);
    const pdf = await loadingTask.promise;

    let fullText = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      fullText += textContent.items.map((item) => item.str).join(" ");
    }
    return fullText;
  };

  const sendFile = async () => {
    if (!userName) {
      // localStorage.setItem("lastPage", "/pages/viewer");
      // dispatch(setLastPage("/pages/viewer"));
      // toastSuperFunctionJS("Please, sign in", "warning");
      localStorage.setItem(
        "myData",
        JSON.stringify({
          activeIndexType,
          activeIndexTone,
          value,
        }),
      );
      setOpenPopupLogin(true);
      return;
    }

    if (!chosenFile) return;

    const extractedText = await extractPdfText(chosenFile);

    const inputPrompt = promptMd[activeIndexType].prompt;
    // const inputPrompt = promptMd[researchType].prompt;
    // console.log("/////    inputPrompt.   //////. ", inputPrompt);
    const TONE = documentTones[activeIndexTone];
    const WORDCOUNT = value;
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
    const additionalNotes = inputAdditional.trim();

    // const response = await fetch("/api/chat", {
    // setLoading(true);
    console.log("/////    Uername   //////. ", userName);
    router.replace("/pages/summary");
    dispatch(setSummary(""));
    const response = await apiFetch("/api/chat", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: extractedText,
        prompt: formattedPrompt,
      }),
    });
    // setIsLoading(false);
    // setLoading(false);
    //await deleteFileFromIndexedDB("current-pdf");
    const result1 = await deleteFileFromIndexedDB("current-pdf");
    if (result1.success) {
      console.log("File deleted!");
    } else {
      console.error("Delete failed:", result1.error);
    }
    dispatch(
      setFileData({
        type: documentTypes[activeIndexType].title,
        style: "",
        depth: WORDCOUNT,
        tone: TONE,
        // or actual base64 string if you generate it
      }),
    );
    if (response) {
      const result = await response.json();
      // const result1 = await response.json();
      console.log("///////////", result);
      // console.log("///////////", result[0].message.content);
      ///////

      // const filteredChoices = Array.isArray(result)
      //   ? result.filter(
      //       (c) => c.message && typeof c.message.content === "string"
      //     )
      //   : [];
      // setChoices(filteredChoices);

      // dispatch(setSummary(filteredChoices));
      dispatch(setSummary(result));

      // setChoices(result);
      // setChoices(Array.isArray(result) ? result : []);
    } else {
      toastSuperFunctionJS("Please, sign in", "warning");
    }
  };

  return (
    <div className={styles.viewerPageContainer}>
      {openPopupLogin && (
        <PopupLoginInner setOpenPopupLogin={setOpenPopupLogin} />
      )}
      <div
        className="navButtonContainer"
        style={{ width: "96px", height: "36px" }}
      >
        <Link href="/">
          <button className="navButton">Home Page</button>
        </Link>
      </div>
      <h1>Let’s Summarize This File 🚀</h1>
      <p>
        Choose your document type, style, and depth — our AI will do the rest.
      </p>
      {/* <p>
        to see how summaries are customized — when you are ready to generate
        your first one,
        </p>
        <p>simply create a free account to unlock the magic.</p> */}

      <div className={styles.pageContainer}>
        <div className={styles.blockWrapper}>
          <div className={styles.blockLargeContainer}>
            <h2>Selected File:</h2>
            <div className={styles.fileBlockSmallContainer}>
              <div className={styles.fileNameContainer}>
                <div className={styles.svgContainer}>
                  <Paper width={"50px"} height={"33px"} />
                </div>
                <div>
                  <h4>{fileMeta.name}</h4>
                  <div className={styles.fileDetails}>
                    {fileMeta.type === "application/pdf" ? "PDF" : ""}
                    <span
                      style={{
                        display: "inline-block",
                        width: "5px",
                        height: "5px",
                        backgroundColor: "white",
                        borderRadius: "50%",
                        margin: "0 8px",
                      }}
                    ></span>
                    <span className={styles.fileSize}>
                      {fileMeta.size > 0 ? formatBytes(fileMeta.size) : ""}
                    </span>{" "}
                    <span
                      style={{
                        display: "inline-block",
                        width: "5px",
                        height: "5px",
                        backgroundColor: "white",
                        borderRadius: "50%",
                        margin: "0 8px",
                      }}
                    ></span>
                    <span className={styles.ready}>
                      <PulseIndicator />
                      Ready
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <button
                  className={styles.buttonPdfViewer}
                  onClick={() => {
                    setOpenViewer(!openViewer);
                    // filePreposition();
                  }}
                >
                  <span className={styles.buttonInside}>
                    {openViewer ? <Eye1 /> : <EyeOff1 />}
                    <span className={styles.preview}>
                      {openViewer ? "Preview File " : "Close Preview"}
                    </span>{" "}
                  </span>
                </button>
              </div>
            </div>
            <div className={styles.blueLine}></div>
          </div>
        </div>
        {!openViewer && (
          <div className={styles.controlsContainer}>
            <div className={styles.controlsPanel}>
              <div className={styles.controlsBox}>
                <div className={styles.pageControls}>
                  <button
                    className={styles.buttonPage}
                    onClick={goToPrevPage}
                    disabled={pageNum <= 1}
                  >
                    <ArrLeft />
                  </button>

                  <button
                    className={styles.buttonPage}
                    onClick={goToNextPage}
                    disabled={pageNum >= totalPages}
                  >
                    <ArrRight />
                  </button>
                </div>
                {pageNum}
                &nbsp;&nbsp; / &nbsp;&nbsp;{totalPages}
                <span
                  style={{
                    width: "1px",
                    height: "30px",
                    backgroundColor: "#aaa",
                    margin: "0 6px",
                  }}
                />
                <div className={styles.rotationControls}>
                  <button onClick={rotateCounterClockwise}>
                    <Arrowright />
                  </button>
                  <button onClick={rotateClockwise}>
                    <Arrowleft />
                  </button>
                </div>
              </div>
            </div>

            <div className={styles.pdfContainer}>
              {/* {console.log("pdf-doc---", pdfDoc)} */}
              <canvas ref={canvasRef} />
            </div>
          </div>
        )}
        <div className={styles.blockWrapper}>
          <div className={styles.blockLargeContainer}>
            <h2>Document Type</h2>
            <p>Select the type that best matches your document</p>
            <div className={styles.typeBlockSmallContainer}>
              {documentTypes.map((item, index) => (
                <div
                  key={index}
                  onClick={() => setActiveIndexType(index)}
                  className={`${styles.chooseButtonContainer} ${
                    activeIndexType === index ? styles.active : ""
                  }`}
                >
                  {/* <div> */}
                  <h6>{item.emoji}</h6>
                  <div>{item.title}</div>
                  <p>{item.par}</p>
                </div>
                // </div>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.blockWrapper}>
          <div className={styles.blockLargeContainer}>
            <h2>Summary Style</h2>
            <p>Choose the tone and writing style for your summary</p>
            <div className={styles.toneBlockSmallContainer}>
              {documentTones.map((item, index) => (
                <div
                  key={index}
                  onClick={() => setActiveIndexTone(index)}
                  className={`${styles.chooseButtonToneContainer} ${
                    activeIndexTone === index ? styles.active : ""
                  }`}
                >
                  <div className={styles.chooseButton}>{item}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.blockWrapper}>
          <div className={styles.blockLargeContainer}>
            <h2>Summary Size & Depth</h2>
            <p>Adjust the length and detail level of your summary</p>
            {/* {documentSize.map((item, index) => (
              <div
              key={index}
              onClick={() => setActiveIndexSize(index)}
              className={`${styles.chooseButtonContainer} ${
                activeIndexSize === index ? styles.active : ""
                }`}
                >
                <div>
                <div className={styles.chooseButton}>{item}</div>
                </div>
                </div>
                ))} */}
            <div className={styles.sliderRange}>
              <SliderRange
                min={300}
                max={1300}
                thumbWidth={20}
                step={1}
                value={value}
                setValue={setValue}
                initial={800}
              />
            </div>
            <div className={styles.smallMediumLargeBox}>
              <span>Small</span>
              <span
                style={{
                  color: "#3C83F6",
                }}
              >
                Medium
              </span>
              <span>Large</span>
            </div>
            <div className={styles.estimatedBox}>
              <span
                style={{
                  fontSize: "20px",
                  color: "#3C83F6",
                  fontWeight: "bold",
                }}
              >
                ⓘ <span style={{ color: "white" }}>&nbsp;Estimated Length</span>
              </span>
              <span
                style={{
                  fontSize: "24px",
                  color: "#3C83F6",
                  fontWeight: "bold",
                }}
              >
                ~&nbsp;{Math.round(value / 100) * 100}&nbsp;
                <span
                  style={{
                    fontSize: "16px",

                    fontWeight: "normal",
                  }}
                >
                  words
                </span>
              </span>
            </div>
          </div>
        </div>
        <div className={styles.blockWrapper}>
          <div className={styles.blockLargeContainer}>
            <h2>Additional Instructions</h2>
            <p>Add any specific requirements or focus areas for your summary</p>
            <div
              className={`${styles.blockContainer} ${styles.blockContainer4}`}
            >
              <input
                type="text"
                value={inputAdditional}
                className={styles.inputAdditional}
                onChange={(e) => setInputAdditional(e.target.value)}
                placeholder="E.g. focus on key metrics, skip introductions, highlight action items..."
              />
            </div>
            <p
              style={{
                fontSize: "11.6px",
              }}
            >
              Optional, but helps improve accuracy
            </p>
          </div>
        </div>
        {/* <button onClick={() => setShowPopup(true)}>Open Popup</button> */}
        {showPopup && (
          <Popup
            // onChoice={(choice) => handleChoice(choice)}
            onCancel={() => setShowPopup(false)}
            option1={() => router.push("/pages/register")}
            option2={() => router.push("/pages/login")}
          />
        )}
      </div>
      <div className={styles.smallFooter}>
        <div
          className={styles.smallFooterButtons}

          // className={`${styles.chooseButtonContainer} ${styles.activeRed}`}
        >
          <div className={styles.buttonAndText}>
            <div className={styles.buttonTokenCost}>
              Token Cost
              <div className={styles.tokenCostNumber}>12</div>
            </div>
            {/* <div> */}
            <FourStar /> Your tokens will be deducted only after the summary is
            generated
            {/* </div> */}
          </div>

          <FlexibleButton
            onClick={sendFile}
            icon={<FourStar />}
            fontSize={"18px"}
            fontFamily="Manrope, sans-serif"
            hoverBackground="#2A3F6A"
            padding="7px 20px"
          >
            Generate Summary!
          </FlexibleButton>

          {/* <button onClick={sendFile} className={styles.buttonGenerateSummary}>
            <FourStar /> Generate Summary!
          </button> */}
        </div>
      </div>
    </div>
  );
}
