"use client";
import DropZoneTest from "@/components/DropZoneTest";
import React, { useState } from "react";

const TestPage = () => {
  const [chosenFile, setChosenFile] = useState(null);

  const [extractedText, setExtractedTexts] = useState();

  const [pdfDoc, setPdfDoc] = useState(null);

  const [totalPages, setTotalPages] = useState(0);
  return (
    <div>
      <DropZoneTest
        setChosenFile={setChosenFile}
        setPdfDoc={setPdfDoc}
        setTotalPages={setTotalPages}
        setExtractedTexts={setExtractedTexts}
      />
    </div>
  );
};

export default TestPage;
