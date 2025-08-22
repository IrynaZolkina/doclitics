"use client";
import "../../globals.css";
import styles from "../css-modules/viewerpage.module.css";

import ReactMarkdown from "react-markdown";
import * as pdfjsLib from "pdfjs-dist";
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";
import OpenAI from "openai";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";

import Button from "@/components-ui/Button";
import Paper from "@/components-ui/svg-components/Paper";
import { formatBytes } from "@/lib/formatBytes";
import { getFileFromIndexedDB, deleteFileFromIndexedDB } from "@/lib/indexeddb";
import Eye1 from "@/components-ui/svg-components/Eye1";
import EyeOff1 from "@/components-ui/svg-components/EyeOff1";
import SliderRange from "../../../components-ui/sliderRange";
import { promptMd } from "@/lib/promptMd";
import { setFileData } from "@/redux/store";

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
  const [extractedText, setExtractedTexts] = useState();
  const [pdfDoc, setPdfDoc] = useState(null);
  const [totalPages, setTotalPages] = useState(0);

  const [pageNum, setPageNum] = useState(1);
  const [activeIndexType, setActiveIndexType] = useState(5);
  const [activeIndexTone, setActiveIndexTone] = useState(3);
  const [activeIndexSize, setActiveIndexSize] = useState(0);
  const [inputAdditional, setInputAdditional] = useState("");
  const [researchType, setResearchType] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [choices, setChoices] = useState([]);

  const canvasRef = useRef(null);
  const dispatch = useDispatch();
  const fileName = useSelector((state) => state.file.fileName);
  const fileType = useSelector((state) => state.file.fileType);
  const fileSize = useSelector((state) => state.file.fileSize);
  console.log("chosenFile---", chosenFile, typeof chosenFile, "*****");
  console.log("fulltext--", extractedText);

  const documentTypes = [
    "Business Report",
    "Literature",
    "Research Paper / Notes",
    "Concept Document",
    "Resume / CV",
    "Meeting Transcript",
    "Other",
  ];
  const documentTones = [
    "Formal",
    "Casual",
    "Academic",
    "Friendly",
    "Persuasive",
    "Neural",
  ];
  const documentSize = ["Normal", "Advanced "];

  useEffect(() => {
    setResearchType(activeIndexType);
  }, [activeIndexType]);

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
    [pdfDoc, rotation] // dependencies
  );

  useEffect(() => {
    if (!openViewer) {
      if (pdfDoc) {
        renderPage(pageNum);
      }
    }
  }, [pdfDoc, pageNum, renderPage, openViewer, scale]);

  // useEffect(() => {
  //   if (pdfDoc) {
  //     renderPage(pageNum);
  //   }
  // }, [pdfDoc, pageNum, scale, rotation, numPages, renderPage]);

  // const renderPage = async (pageNumber) => {
  //   if (!pdfDoc) return;

  //   const page = await pdfDoc.getPage(pageNumber);
  //   const canvas = canvasRef.current;
  //   const context = canvas.getContext("2d");

  //   // Apply rotation
  //   const viewport = page.getViewport({ scale, rotation: rotation });

  //   // Set canvas dimensions to match the viewport
  //   canvas.height = viewport.height;
  //   canvas.width = viewport.width;

  //   // Render the PDF page
  //   const renderContext = {
  //     canvasContext: context,
  //     viewport: viewport,
  //   };

  //   await page.render(renderContext).promise;
  // };

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

    // renderPage(currentPage);
  };

  const rotateCounterClockwise = () => {
    setRotation((prevRotation) => (prevRotation - 90 + 360) % 360);
    // renderPage(numPages);
  };
  const handleNextPage = async () => {
    if (currentPage < numPages) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      await renderPage(arrayBuffer, newPage, scale, rotation);
    }
  };
  const filePreposition = async () => {
    if (!chosenFile) {
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
            dispatch(
              setFileData({
                storeExtractedTexts: fullText,
              })
            );
          } catch (error) {
            console.error("Error loading PDF:", error);
            alert("Error loading PDF file");
          }
        };
        //read
      } catch (error) {
        console.error("Error getting file from IndexedDB:", error);
      }
    }
  };

  // if (error) return <p style={{ color: "red" }}>{error}</p>;
  // if (!pageUrl) return <p>Загрузка PDF...</p>;
  // filePreposition();

  // Update track background
  // useEffect(() => {
  //   const slider = sliderRef.current;
  //   if (!slider) return;

  //   const percentage = ((value - slider.min) / (slider.max - slider.min)) * 100;

  //   // left color: green, right color: light gray
  //   const bg = `linear-gradient(to right, #4caf50 0%, #4caf50 ${percentage}%, #ddd ${percentage}%, #ddd 100%)`;

  //   slider.style.background = bg;
  // }, [value]);

  const sendFile = async () => {
    //const apiKey = process.env.DEEPSEEK_API_KEY;
    // if (!filesend) {
    //   return;
    // }
    // extractTextFromPdf();

    const inputPrompt = promptMd[researchType].prompt;
    console.log("/////    inputPrompt.   //////. ", inputPrompt);
    console.log("/////    extractedText.   //////. ", extractedText);
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: extractedText,
        prompt: inputPrompt,
      }),
    });
    setIsLoading(false);
    const result = await response.json();
    console.log("///////////", result.choices);
    ///////
    setChoices(result.choices);
  };

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
          <div className={styles.blockWrapper}>
            <h2>Selected File:</h2>
            <div className={styles.blockContainer}>
              <div>
                <Paper />
              </div>
              <div>{fileName}</div>
              <div className={styles.block}>
                {fileSize > 0 ? formatBytes(fileSize) : ""}
              </div>
              <div className={styles.block}>.{fileType}</div>
              <div>
                <Button
                  onClick={() => {
                    setOpenViewer(!openViewer);
                    filePreposition();
                  }}
                  bg={"rgba(60, 131, 246, 0.05)"}
                  borderColor={"rgba(85, 147, 247, 0.3)"}
                  height={"55px"}
                  width={"151px"}
                  radius={"13px"}
                >
                  <span className={styles.buttonInside}>
                    {openViewer ? <Eye1 /> : <EyeOff1 />}
                    <span className={styles.preview}>
                      {openViewer ? "Preview" : "Close Preview"}
                    </span>
                  </span>
                </Button>
              </div>
            </div>
          </div>
          {!openViewer && (
            <div className={styles.controlsContainer}>
              <div className={styles.controlsBox}></div>
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
          )}
          <div className={styles.blockWrapper}>
            <h2>Document Type</h2>
            <p>What kind of document is this?</p>
            <div className={styles.blockContainer2}>
              {documentTypes.map((item, index) => (
                <div
                  key={index}
                  onClick={() => setActiveIndexType(index)}
                  className={`${styles.chooseButtonContainer} ${
                    activeIndexType === index ? styles.active : ""
                  }`}
                >
                  <div>
                    <div className={styles.chooseButton}>{item}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.blockWrapper}>
            <h2>Tone & Style</h2>
            <p>Choose a tone or a style for the Summary</p>
            <div className={styles.blockContainer3}>
              {documentTones.map((item, index) => (
                <div
                  key={index}
                  onClick={() => setActiveIndexTone(index)}
                  className={`${styles.chooseButtonContainer} ${
                    activeIndexTone === index ? styles.active : ""
                  }`}
                >
                  <div>
                    <div className={styles.chooseButton}>{item}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.blockWrapper}>
            <h2>Size & Depth</h2>
            <p>How deep do you want your summary to go?</p>
            <div className={styles.blockContainer3}>
              {documentSize.map((item, index) => (
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
              ))}
              <div className={styles.sliderRange}>
                <SliderRange
                  min={300}
                  max={2000}
                  thumbWidth={20}
                  step={20}
                  initial={500}
                />
              </div>
            </div>
          </div>
          <div className={styles.blockWrapper}>
            <h2>Additional Notes</h2>
            <p>Any additional details you whould like the AI to focus on</p>
            <div
              className={`${styles.blockContainer} ${styles.blockContainer4}`}
            >
              <input
                type="text"
                value={inputAdditional}
                className={styles.inputAdditional}
                onChange={(e) => setInputAdditional(e.target.value)}
                placeholder="E.g. “Focus on marketing trends” or “Skip boilerplate intros”"
              />
            </div>
          </div>
          <div
            onClick={sendFile}
            // className={`${styles.chooseButtonContainer} ${styles.activeRed}`}
          >
            <button className={styles.button}>Generate Summary!</button>
          </div>
        </div>
        <div className={styles.summaryContainer}>
          {choices &&
            choices.map((choice) => {
              return (
                <ReactMarkdown key={choice.index}>
                  {choice.message.content}
                </ReactMarkdown>
              );
            })}
        </div>
      </div>
    </div>
  );
}
