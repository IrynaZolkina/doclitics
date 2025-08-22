"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";

import styles from "./css-modules/navbar.module.css";

import "../app/globals.css";

import ReactMarkdown from "react-markdown";
import OpenAI from "openai";

import HeroSection from "./HeroSection";
import HowWorksSection from "./HowWorksSection";
import SupportSection from "./SupportSection";
import PrivateSection from "./PrivateSection";
import PriceSection from "./PriceSection";
import Dashboard from "./Dashboard";
import Loved from "./Loved";
// import { extractTextFromPdf } from "@/lib/textutils";
// import Loved from "./Loved";
// import pdfjsLib from "pdfjs-dist/legacy/build/pdf.js";
// import { DOMMatrix } from "canvas"; // npm install canvas
// global.DOMMatrix = DOMMatrix;
import * as pdfjsLib from "pdfjs-dist";
import { getFileFromIndexedDB } from "@/lib/indexeddb";
import FaqSection from "./FaqSection";
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";

const navItems = [
  { label: "Home", href: "#dashboard" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Security", href: "#security" },
  { label: "Reviews", href: "#reviews" },
  { label: "FAQ", href: "#faq" },
];
const navItemsDashboard = [
  // { label: "Home", href: "#dashboard" },
  { label: "Home", href: "#" },
];

export function NavbarN() {
  const [filesend, setFilesend] = useState();

  const [chosenFile, setChosenFile] = useState(null);
  const [extractedText, setExtractedTexts] = useState();
  const [pdfDoc, setPdfDoc] = useState(null);
  const [totalPages, setTotalPages] = useState(0);

  const [inputPrompt, setInputPrompt] = useState("");
  const [pdfD, setPdfD] = useState(false);
  const [openSection, setOpenSection] = useState("");
  const [pageNum, setPageNum] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [rotation, setRotation] = useState(0);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [choices, setChoices] = useState([]);

  console.log("chosenFile---", chosenFile, typeof chosenFile, "*****");
  console.log("fulltext--", extractedText);
  let fileName = "";
  if (chosenFile !== null) {
    fileName = chosenFile.name;
    // setFilesend(chosenFile);
    // const text = extractTextFromPdf(chosenFile);
    console.log("c*****************s", fileName, "*****");
  }
  const scrollToSection = (href) => {
    const element = document.getElementById(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };
  const extractTextFromPdf = async (file) => {
    console.log("c*****************---sextractTex", file, "tFromPdf---*****");
    const fileReader = new FileReader();

    fileReader.onload = async function (e) {
      console.log("^^^^^^^^^^^^^^^^^^^^^^^^");
      const typedarray = new Uint8Array(this.result);

      const pdf = await pdfjsLib.getDocument(typedarray).promise;
      console.log("^^^^^^^^^^^^^^^^^^^^^^^^");
      let fullText = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        fullText += textContent.items.map((item) => item.str).join(" ");
      }

      console.log("fulltext--", fullText);
      setExtractedTexts(fullText);
      setIsLoading(true);
    };
  };
  // Navigation functions

  // Re-render when page number, scale or rotation changes
  //   useEffect(() => {
  //     if (pdfDoc && pdfD) {
  //       renderPage(pageNum);
  //     }
  //   }, [pdfDoc, pdfD, pageNum, scale, rotation]);

  //   const renderPage = async (pageNumber) => {
  //     if (!pdfDoc) return;

  //     const page = await pdfDoc.getPage(pageNumber);
  //     const canvas = canvasRef.current;
  //     const context = canvas.getContext("2d");

  //     // Apply rotation
  //     const viewport = page.getViewport({ scale, rotation: rotation });

  //     // Set canvas dimensions to match the viewport
  //     canvas.height = viewport.height;
  //     canvas.width = viewport.width;

  //     // Render the PDF page
  //     const renderContext = {
  //       canvasContext: context,
  //       viewport: viewport,
  //     };

  //     await page.render(renderContext).promise;
  //   };

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

  const sendFile = async () => {
    //const apiKey = process.env.DEEPSEEK_API_KEY;
    // if (!filesend) {
    //   return;
    // }

    // extractTextFromPdf();
    console.log("/////    inputPrompt.   //////. ", inputPrompt);
    const response = await fetch("api/chat", {
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
    <div>
      <nav className={styles.navbarContainer}>
        <div className={styles.flexContainer}>
          {chosenFile === null ? (
            <div className={styles.navContainer}>
              {navItems.map((item) => (
                <div key={item.label} className="label">
                  <button
                    onClick={() => scrollToSection(item.href)}
                    className={styles.navItem}
                  >
                    {item.label}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.navContainer2}>
              {navItemsDashboard.map((item) => (
                <div key={item.label} className="label">
                  <button
                    onClick={() => scrollToSection(item.href)}
                    className={styles.navItem}
                  >
                    {item.label}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* CTA Button */}
        </div>
        <div
          className="navButtonContainer"
          style={{ width: "96px", height: "36px" }}
        >
          <Link href="/register">
            <button className="navButton">Get Started</button>
          </Link>
        </div>
      </nav>
      {/* {chosenFile === null ? ( */}
      <>
        <div id="#dashboard" className="section">
          <HeroSection
            setChosenFile={setChosenFile}
            setPdfDoc={setPdfDoc}
            setTotalPages={setTotalPages}
            setExtractedTexts={setExtractedTexts}
          />
        </div>

        <div id="#features" className="section">
          <HowWorksSection />
          <SupportSection />
        </div>

        <div id="#security" className="section">
          <PrivateSection />
        </div>
        <div id="#pricing" className="section">
          <PriceSection />
        </div>
        <div id="#reviews" className="section">
          <Loved />
        </div>
        <div id="#faq" className="section">
          <FaqSection />
        </div>
      </>
      {/* ) : (
        <>
          <Dashboard fileName={fileName} />

          {pdfD && pdfDoc && (
            <div className={styles.pdfWrapper}>
              <div className={styles.controlsContainer}>
                <div className={styles.pageControls}>
                  <button onClick={goToPrevPage} disabled={pageNum <= 1}>
                    Previous
                  </button>
                  <span>
                    Page {pageNum} of {totalPages}
                  </span>
                  <button
                    onClick={goToNextPage}
                    disabled={pageNum >= totalPages}
                  >
                    Next
                  </button>
                </div>

                <div className={styles.pdfContainer}>
                  {console.log("pdf-doc---", pdfDoc)}
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
              </div>
              <label>
                Input prompt
                <textarea
                  name="inputPrompt"
                  rows={7}
                  cols={70}
                  value={inputPrompt}
                  onChange={(e) => setInputPrompt(e.target.value)}
                />
              </label>
              <button onClick={sendFile}>SUMMARY</button>
            </div>
          )}
          <button onClick={sendFile}>SUMMARY</button>
          <button onClick={() => setPdfD(!pdfD)}>PREVIEW</button>
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
        </>
      )} */}
    </div>
  );
}
