import * as pdfjsLib from "pdfjs-dist";
// import "pdfjs-dist/build/pdf.worker.entry";
import { getDocument } from "pdfjs-dist";
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";

export const extractTextFromPdf = async (file) => {
  // const [chosenFile, setChosenFile] = useState(null);

  try {
    const fileReader = new FileReader();
    fileReader.onload = async function () {
      const typedarray = new Uint8Array(this.result);
      const pdf = await pdfjsLib.getDocument(typedarray).promise;
      let textContent = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textLayer = await page.getTextContent();
        textContent += textLayer.items.map((item) => item.str).join(" ");
      }
      console.log("rrayBuffer******", textContent, "*****");
      return textContent;
      //   setExtractedText(textContent);

      // fileReader.readAsArrayBuffer(file);
    };
  } catch (error) {
    console.log("error", error, "*****");
  }
  console.log("---------------", file, "*****");
};
