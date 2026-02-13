import { getCsrfTokens, validateCsrf } from "@/lib/auth/csrf";
import { verifyAccessToken } from "@/lib/jwt";
import clientPromise from "@/lib/mongodb/mongodb";
import { errorResponse } from "@/lib/responsehandlers/errorResponse";
import { successResponse } from "@/lib/responsehandlers/successResponse";
import { ObjectId } from "mongodb";

import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
function countWords(str) {
  if (!str || typeof str !== "string") return 0;
  return str.split(/[ \t\n]+/).filter(Boolean).length;
}
export async function POST(request) {
  // const reqId = request.headers.get("x-request-id");
  console.log("CHAT HIT ----:------------------ 1 ");
  try {
    // ✅ CSRF (reuse your helper)
    try {
      const { csrfHeader, csrfCookie } = getCsrfTokens(request);
      validateCsrf(csrfHeader, csrfCookie);
    } catch (err) {
      console.log("CHAT ERROR ----:------------------ 1 ");
      return errorResponse(
        "CSRF_MISMATCH",
        err.message || "CSRF mismatch",
        403,
      );
    }
    console.log("CHAT HIT ----:------------------ 2 ");
    // ✅ Require access token
    const token = request.cookies.get("accessToken")?.value;
    if (!token) {
      return errorResponse("NO_TOKEN", "No token. Not authorized", 401);
    }

    // ✅ Verify token (separate from OpenAI call)
    let payload;
    try {
      payload = verifyAccessToken(token);
    } catch {
      console.log("CHAT ERROR ----:------------------ 2 ");
      return errorResponse("ACCESS_EXPIRED", "Access token expired", 401);
    }
    if (!payload?.userId) {
      return errorResponse("INVALID_TOKEN", "Access token invalid", 401);
    }
    console.log("CHAT HIT ----:------------------ 3 ");
    // ✅ Parse body safely

    let params;
    try {
      params = await request.json();
    } catch {
      console.log("CHAT ERROR ----:------------------ 3 ");
      return errorResponse("BAD_JSON", "Invalid JSON body", 400);
    }

    const prompt = params?.prompt;
    const content = params?.content;
    const fileName = params?.fileName;

    console.log("CHAT HIT ----:------------------ 4 ");

    if (!prompt || !content) {
      return errorResponse("BAD_REQUEST", "Missing prompt or content", 400);
    }

    // console.log("params.prompt---", params.prompt);
    // console.log("params.content---", params.content);

    // ✅ Ownership / quota check (MongoDB truth)
    const userId = ObjectId.createFromHexString(payload.userId);
    let client;

    console.log("CHAT HIT ----:------------------ 5 ");
    try {
      client = await clientPromise;
    } catch (e) {
      console.error("MONGODB_CONNECT_FAILED:", e);
      console.log("CHAT ERROR ----:------------------ 4 ");
      return errorResponse(
        "DB_CONNECT_FAILED",
        "Cannot connect to database. Check MongoDB Atlas IP allowlist / URI / network.",
        500,
        { code: e?.code, syscall: e?.syscall, hostname: e?.hostname },
      );
    }
    console.log("CHAT HIT ----:------------------ 6 ");
    const db = client.db("doclitic");

    const user = await db
      .collection("users")
      .findOne(
        { _id: userId },
        { projection: { docsAmount: 1, subscriptionStatus: 1, plan: 1 } },
      );
    console.log("User from DB access token:", user);
    if (!user) {
      console.log("CHAT ERROR ----:------------------ User not found ");
      return errorResponse("NO_USER", "User not found", 401);
    }

    //     if (
    //       user.subscriptionStatus !== "active" &&
    //       user.subscriptionStatus !== "canceling"
    //     ) {
    //       return errorResponse("NOT_ACTIVE", "Subscription not active", 403);
    //     }

    if ((user.docsAmount ?? 0) <= 0) {
      return errorResponse("NO_CREDITS", "No credits left", 402);
    }
    // const reserve = await db.collection("users").updateOne(
    //   {
    //     _id: user._id,
    //     docsAmount: { $gt: 0 },
    //     subscriptionStatus: { $in: ["active", "canceling"] },
    //   },
    //   { $inc: { docsAmount: -1 }, $set: { updatedAt: new Date() } },
    // );
    // console.log
    //     if (reserve.modifiedCount === 0) {
    //       return errorResponse("NO_CREDITS", "No credits left", 402);
    //     }

    //     const updatedUser = await db.collection("users").findOne(
    //   { _id: user._id },
    //   { projection: { docsAmount: 1 } },
    // );

    // 1) Reserve credit atomically and get updated docsAmount
    // const reserve = await db.collection("users").findOneAndUpdate(
    //   {
    //     _id: ObjectId.createFromHexString(payload.userId),
    //     docsAmount: { $gt: 0 },
    //     subscriptionStatus: { $in: ["active", "canceling"] },
    //   },
    //   { $inc: { docsAmount: -1 }, $set: { updatedAt: new Date() } },
    //   { returnDocument: "after", projection: { docsAmount: 1 } },
    // );
    // console.log(
    //   "CHAT HIT ----:------------------ 7 ObjectId.createFromHexString(payload.userId ",
    //   ObjectId.createFromHexString(payload.userId),
    // );
    // if (!reserve.value) {
    //   const u = await db
    //     .collection("users")
    //     .findOne(
    //       { _id: ObjectId.createFromHexString(payload.userId) },
    //       { projection: { docsAmount: 1 } },
    //     );
    //   console.log("CHAT HIT ----:------------------ 8 ");
    //   return errorResponse("NO_CREDITS", "No credits left---MongoDb", 402, {
    //     docsAmount: u?.docsAmount ?? 0,
    //   });
    //   // return errorResponse("NO_CREDITS", "No credits left", 402);
    // }

    // const updatedDocsAmount = reserve.value.docsAmount ?? 0;

    // const updatedDocsAmount = updatedUser?.docsAmount ?? 0;

    // ✅ Call model
    try {
      const openai = new OpenAI({
        baseURL: "https://openrouter.ai/api/v1",
        apiKey: process.env.DEEPSEEK_API_KEY,
      });
      console.log("CHAT HIT ----:------------------ 9 ");
      const completion = await openai.chat.completions.create({
        // model: "deepseek/deepseek-r1-0528-qwen3-8b:free", // Reasoning models (slow, but free)
        // model: "mistralai/mistral-7b-instruct:free",
        //model: "qwen/qwen2.5-7b-instruct:free",
        // model: "deepseek/deepseek-r1",
        model: "deepseek/deepseek-r1-0528:free",

        messages: [
          { role: "system", content: prompt },
          { role: "user", content: content },
        ],

        temperature: 0,
        max_tokens: 256, //1024, //4096,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });

      // const response = completion.choices;
      // return NextResponse.json(
      //   { success: true, data: { user } },
      //   { status: 200 }
      // );
      // const response = completion.choices[0]?.message?.content || "";
      const text = completion.choices?.[0]?.message?.content || "";

      // ✅ decrement docsAmount AFTER success (basic approach)
      const updatedDocsAmount = await db.collection("users").findOneAndUpdate(
        { _id: userId }, // filter
        { $inc: { docsAmount: -1 } }, // update
        {
          returnDocument: "after",
          projection: {
            docsAmount: 1,
            _id: 0, // optional: hide _id
          },
        }, // ← return updated doc
      );
      console.log("decrementUserDocsAmount------", updatedDocsAmount);
      // const reserve = await db.collection("users").findOneAndUpdate(
      //   {
      //     _id: ObjectId.createFromHexString(payload.userId),
      //     docsAmount: { $gt: 0 },
      //     subscriptionStatus: { $in: ["active", "canceling"] },
      //   },
      //   { $inc: { docsAmount: -1 }, $set: { updatedAt: new Date() } },
      //   { returnDocument: "after", projection: { docsAmount: 1 } },
      // );

      // 1) save summary
      const insert = await db.collection("summaries").insertOne({
        summary_text: text,
        summary_text_length: countWords(text),
        fileName: fileName,
        userId,
        createdAt: new Date(),
      });
      const userSummaries = await db
        .collection("summaries")
        .find(
          { userId: userId },
          {
            projection: {
              _id: 0,
              fileName: 1,
              summary_text_length: 1,
              createdAt: 1,
            },
          },
        )
        .sort({ createdAt: -1 }) // optional: newest first
        .toArray();
      // 3) Success: keep credit spent
      return successResponse(
        // { text },
        { text, docsAmount: updatedDocsAmount.docsAmount, userSummaries },
        "OK",
        200,
      );
      // return NextResponse.json({ success: true, data: text }, { status: 200 });
    } catch (err) {
      console.log("CHAT HIT ----:------------------ 9 ");
      // 3) Failure: refund credit and return refunded docsAmount
      // let refundedDocsAmount = updatedDocsAmount;
      // try {
      //         await db
      //           .collection("users")
      //           .updateOne(
      //             { _id: user._id },
      //             { $inc: { docsAmount: 1 }, $set: { updatedAt: new Date() } },
      //           );
      //           const refundedUser = await db.collection("users").findOne(
      //   { _id: user._id },
      //   { projection: { docsAmount: 1 } },
      // );
      // refundedDocsAmount = refundedUser?.docsAmount ?? 0;
      // const refund = await db
      //   .collection("users")
      //   .findOneAndUpdate(
      //     { _id: ObjectId.createFromHexString(payload.userId) },
      //     { $inc: { docsAmount: 1 }, $set: { updatedAt: new Date() } },
      //     { returnDocument: "after", projection: { docsAmount: 1 } },
      //   );
      // refundedDocsAmount = refund.value?.docsAmount ?? refundedDocsAmount;
      // } catch (refundErr) {
      //   console.error("REFUND_FAILED:", refundErr);
      // }
      const status =
        err?.status ||
        err?.response?.status ||
        (err?.message?.includes("429") ? 429 : 500);

      if (status === 429) {
        return errorResponse(
          "RATE_LIMIT",
          "Model is busy or rate limited",
          429,
          // { docsAmount: refundedDocsAmount },
        );
      }

      console.error("MODEL_ERROR raw:", {
        status: err?.status,
        responseStatus: err?.response?.status,
        message: err?.message,
        name: err?.name,
      });
      // Send back something actually helpful
      return errorResponse(
        "MODEL_ERROR",
        `Upstream model error (status ${status}). ${err?.message || ""}`.trim(),
        status,
        // { docsAmount: refundedDocsAmount }, // only if your errorResponse supports data
      );
    }
  } catch (err) {
    console.error("UNEXPECTED_ERROR:", err);
    return errorResponse("SERVER_ERROR", "Server error", 500);
  }
}
