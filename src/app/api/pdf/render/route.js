export const runtime = "nodejs";

import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.js";
import { createCanvas } from "@napi-rs/canvas";

export async function POST(req) {
  try {
    const data = await req.arrayBuffer();
    const {
      page = "1",
      scale = "1.5",
      rotation = "0",
    } = Object.fromEntries(req.headers);

    const pdf = await pdfjsLib.getDocument({
      data,
      isEvalSupported: false,
      disableFontFace: true,
    }).promise;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    if (pageNum > pdf.numPages) {
      return new Response(`Page out of range (1..${pdf.numPages})`, {
        status: 400,
      });
    }

    const pageObj = await pdf.getPage(pageNum);

    const viewport = pageObj.getViewport({
      scale: parseFloat(scale) || 1.5,
      rotation: parseInt(rotation, 10) || 0,
    });

    const canvas = createCanvas(viewport.width, viewport.height);
    const ctx = canvas.getContext("2d");

    await pageObj.render({ canvasContext: ctx, viewport }).promise;

    const png = canvas.toBuffer("image/png");
    return new Response(png, { headers: { "Content-Type": "image/png" } });
  } catch (e) {
    console.error(e);
    return new Response(String(e.message || e), { status: 500 });
  }
}
