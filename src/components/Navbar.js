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
// import { extractTextFromPdf } from "@/lib/textutils";

import * as pdfjsLib from "pdfjs-dist";
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

export function Navbar() {
  const [chosenFile, setChosenFile] = useState(null);
  const [filesend, setFilesend] = useState();
  const [extractedText, setExtractedTexts] = useState();
  const [inputPrompt, setInputPrompt] = useState("");

  const [pdfDoc, setPdfDoc] = useState(null);
  const [pdfD, setPdfD] = useState(false);
  const [openSection, setOpenSection] = useState("");
  const [pageNum, setPageNum] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
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

      // const response = await fetch("api/chat", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     content: fullText,
      //     prompt:
      //       "You are an expert business analyst and professional technical summarizer. You will read and analyze a formal business report and produce a polished, well-structured executive summary tailored for senior decision-makers (e.g., CEOs, investors, consultants). 🎯 Your objective is to extract strategic value from the report, focusing on goals, performance metrics, insights, risks, and actionable outcomes. Return your response in the following format: 📘 Report Summary: Insert Report Title 🔹 Executive Summary Summarize the report in 3–5 high-impact sentences. Convey the strategic goal, key findings, and overall tone or implications. 🎯 Report Objectives List the original purpose or goals of the report (e.g., analyze quarterly sales, evaluate market entry, assess risks). 📊 Key Findings Bullet-style list of the most important insights. Prioritize metrics, outcomes, trends, and discoveries. Each point should be concise, strong, and standalone. Page 4 of 11 📈 Data Highlights Provide notable statistics, KPIs, or financials mentioned in the report. Use bullet format or short data tables. ⚠️ Risks or Challenges Clearly list any risks, weaknesses, or critical concerns raised. Use bold or italics for high-priority items. ✅ Strategic Recommendations If the report proposes action steps, summarize them here. Use formal business tone, and phrase each as an executive suggestion. 🧾 Final Takeaway One short paragraph that reflects the overall implication of the report. Think like a strategist — what should the C-suite care most about? 📌 Notes: Use formal tone throughout. Be concise, but never vague. Do not repeat sections verbatim. Never fabricate data — if unavailable, say “Not specified.”",
      //     // "You are very grumpy. Please answer my questions with sarcasm, grumpiness and anger",
      //   }),
      // });
      // setIsLoading(false);
      // const result = await response.json();
      // console.log("///////////", result.choices);
      // setChoices(result.choices);
    };
    // fileReader.readAsArrayBuffer(file);
    // const reader = new FileReader();
    // reader.onload = async (file) => {};
  };
  // useEffect(() => {
  //   const navElements = document.querySelectorAll(".label");
  //   window.addEventListener("scroll", () => {
  //     if (typeof window !== "undefined") {
  //       console.log(".label-----", navElements);
  //       console.log("window.scrollY", window.scrollY);

  //       if (window.scrollY >= 0 && window.scrollY < 308) {

  //         navElements.forEach((el, index) => {
  //           if (index === 0) {
  //             el.className = "active";
  //           } else {
  //             el.className = styles.navItem; // Reset all nav items
  //           }
  //         });
  //       } else if (window.scrollY >= 308 && window.scrollY < 460) {
  //         navElements.forEach((el, index) => {
  //           if (index === 1) {
  //             el.className = "active";
  //           } else {
  //             el.className = styles.navItem; // Reset all nav items
  //           }
  //         });
  //       } else if (window.scrollY >= 460 && window.scrollY < 2800) {
  //         navElements.forEach((el, index) => {
  //           if (index === 3) {
  //             el.className = "active";
  //           } else {
  //             el.className = styles.navItem; // Reset all nav items
  //           }
  //         });
  //       } else if (window.scrollY >= 2800 && window.scrollY < 4200) {
  //         navElements.forEach((el, index) => {
  //           if (index === 2) {
  //             el.className = "active";
  //           } else {
  //             el.className = styles.navItem; // Reset all nav items
  //           }
  //         });
  //       } else if (window.scrollY >= 4200 && window.scrollY < 10000) {
  //         navElements.forEach((el, index) => {
  //           if (index === 4) {
  //             el.className = "active";
  //           } else {
  //             el.className = styles.navItem; // Reset all nav items
  //           }
  //         });
  //       }
  //     }
  //   });
  //   return () => {
  //     window.removeEventListener("scroll", () => {});
  //   };
  // }, []);

  // Navigation functions

  // Re-render when page number, scale or rotation changes
  useEffect(() => {
    if (pdfDoc && pdfD) {
      renderPage(pageNum);
    }
  }, [pdfDoc, pdfD, pageNum, scale, rotation]);

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
        // "Summarize the following text in Markdown format. Use headings (H1 and H2), bold text, italic text, and quotes where necessary to highlight key points. Ensure the summary is concise and captures the main ideas of the original text. here is an example output. # Summary of the Text ## Main Points *This is a concise summary of the main points:* - Key Point 1: This is the first key point from the original text. - Key Point 2: This is the second key point, highlighting important details. - *Italicized Text:* This part of the summary uses italics to emphasize a particular point. ## Additional Details *Quotes from the original text:* > 'This is a direct quote from the text emphasizing a critical idea.' *Bold Text:* This part of the summary uses bold to highlight a significant aspect.*Italicized Text:* This part of the summary uses italics to emphasize another important point.",
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
          {/* Logo */}
          {/* <div className={styles.flexLogo} onClick={() => dbb()}>
              <div className={styles.logoBox}>
                <Image src="Group 1.svg" alt="Logo" width={40} height={40} />
              </div>
              <span className={styles.logoText}>Doclitic</span>
            </div> */}

          {/* Navigation Links */}
          {chosenFile === null ? (
            <div className={styles.navContainer}>
              {navItems.map((item) => (
                // <Link href={item.href} key={item.label}>
                <div key={item.label} className="label">
                  <button
                    onClick={() => scrollToSection(item.href)}
                    // reviewsRef.current?.scrollIntoView({ behavior: "smooth" })

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
                // <Link href={item.href} key={item.label}>
                <div key={item.label} className="label">
                  <button
                    onClick={() => scrollToSection(item.href)}
                    // reviewsRef.current?.scrollIntoView({ behavior: "smooth" })

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
        <div className={styles.navButtonContainer}>
          <Link href="/register">
            <button className={styles.navButton}>Get Started</button>
          </Link>
        </div>
      </nav>
      {chosenFile === null ? (
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
          <div id="#reviews" className="section"></div>
          <div id="#faq" className="section"></div>
        </>
      ) : (
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
      )}
    </div>
  );
}
