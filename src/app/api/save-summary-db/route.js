import { verifyAccessToken } from "@/lib/jwt";
import { errorResponse } from "@/lib/responsehandlers/errorResponse";
import clientPromise from "@/lib/mongodb/mongodb";

import { ObjectId } from "mongodb";

import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { successResponse } from "@/lib/responsehandlers/successResponse";

export async function POST(request) {
  console.log(
    "..........POST request received at /api/save-summary-db..........",
  );
  // ✅ CSRF check
  const csrfHeader = request.headers.get("x-csrf-token");
  const csrfCookie = request.cookies.get("csrfToken")?.value;
  if (!csrfHeader || !csrfCookie || csrfHeader !== csrfCookie) {
    return errorResponse("CSRF_MISMATCH", "CSRF mismatch. Not authorized", 403);
  }

  // ✅ Access token
  const token = request.cookies.get("accessToken")?.value;
  if (!token) return errorResponse("NO_TOKEN", "No token. Not authorized", 401);

  try {
    const payload = verifyAccessToken(token);
    if (!payload?.userId) {
      return errorResponse("INVALID_TOKEN", "Access token invalid", 401);
    }

    const userId = payload.userId; // string
    const client = await clientPromise;
    const db = client.db("doclitic");
    // ✅ Parse body safely
    let params;
    try {
      params = await request.json();
    } catch {
      return errorResponse("BAD_JSON", "Invalid JSON body", 400);
    }

    const { summary_text, summary_text_length } = params || {};
    if (!summary_text || !summary_text_length) {
      return errorResponse(
        "BAD_REQUEST",
        "Missing summary_text or length",
        400,
      );
    }
    console.log("summary_text_length---", summary_text_length);

    // 1) save summary
    const insert = await db.collection("summaries").insertOne({
      summary_text,
      summary_text_length,
      userId,
      createdAt: new Date(),
    });

    // 2) update stats (✅ NO docsAmount decrement here)
    const userDoc = await db
      .collection("users")
      .findOne(
        { _id: ObjectId.createFromHexString(userId) },
        { projection: { averageWords: 1 } },
      );

    const oldValue =
      typeof userDoc?.averageWords === "number"
        ? userDoc.averageWords
        : summary_text_length;

    const newValue = (oldValue + summary_text_length) / 2;

    await db.collection("users").updateOne(
      { _id: ObjectId.createFromHexString(userId) },
      {
        $set: { averageWords: newValue, updatedAt: new Date() },
        $inc: { totalDocs: 1 },
      },
    );

    return successResponse(
      { summaryId: insert.insertedId },
      "Saved summary",
      200,
    );
  } catch (err) {
    console.log("save-summary-db error:", err);
    return errorResponse("SERVER_ERROR", "Failed to save summary", 500);
  }
}
