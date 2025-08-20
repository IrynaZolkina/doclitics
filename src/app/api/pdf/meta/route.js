// Серверный API route: возвращает numPages и метаданные
export const runtime = "nodejs";

import pdf from "pdf-parse";

export async function POST(req) {
  try {
    const arrayBuffer = await req.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const pdfData = await pdf(buffer);

    return Response.json({
      numPages: pdfData.numpages,
      info: pdfData.info,
    });
  } catch (e) {
    console.error("PDF parse error:", e);
    return Response.json({ error: String(e.message || e) }, { status: 500 });
  }
}
