import { NextResponse } from "next/server";
// import chromium from "chrome-aws-lambda";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import { marked } from "marked";
import { stripEmojis } from "@/utils/stripEmojis";

export async function POST(req) {
  try {
    const { markdown, title = "Untitled PDF" } = await req.json();

    // 1️⃣ Remove all emojis
    const cleanMarkdown = stripEmojis(markdown);

    // 2️⃣ Convert to HTML
    const html = `
      <html>
        <head>
          <meta charset="utf-8" />
          <style>
            body { font-family: Arial; padding: 40px; color: #222; line-height: 1.6; }
            h1, h2, h3 { color: #0070f3; border-bottom: 1px solid #eee; padding-bottom: 4px; }
            p, li { font-size: 14px; }
            ul, ol { margin-left: 20px; }
            .footer { text-align:center; font-size:12px; color:#777; margin-top:40px; }
          </style>
        </head>
        <body>
          ${marked(cleanMarkdown)}
          <div class="footer">Generated automatically — ${new Date().toLocaleDateString()}</div>
        </body>
      </html>
    `;

    // const browser = await puppeteer.launch({
    //   args: chromium.args,
    //   defaultViewport: chromium.defaultViewport,
    //   executablePath:
    //     process.env.NODE_ENV === "development"
    //       ? undefined
    //       : await chromium.executablePath,
    //   headless: true,
    // });
    // Launch Chromium (serverless-friendly)
    // const browser = await puppeteer.launch({
    //   args: chromium.args,
    //   defaultViewport: chromium.defaultViewport,
    //   executablePath: await chromium.executablePath,
    //   headless: chromium.headless,
    // });

    // Use local Chromium in dev, @sparticuz/chromium on Vercel
    const isDev = process.env.NODE_ENV === "development";

    // const executablePath = isDev ? undefined : await chromium.executablePath();

    // const browser = await puppeteer.launch({
    //   args: isDev ? [] : chromium.args,
    //   defaultViewport: chromium.defaultViewport,
    //   executablePath,
    //   headless: true,
    // });
    let browser;

    if (isDev) {
      const puppeteerFull = await import("puppeteer"); // only dev
      browser = await puppeteerFull.default.launch({ headless: true });
    } else {
      const executablePath = await chromium.executablePath();
      browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath,
        headless: chromium.headless,
      });
    }
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "20mm", bottom: "20mm" },
    });

    await browser.close();

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${title}.pdf"`,
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
