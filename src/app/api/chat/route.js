import { verifyAccessToken } from "@/lib/jwt";
import { errorResponse } from "@/utils/errorHandler";

import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request) {
  const params = await request.json();
  const apiKey = process.env.DEEPSEEK_API_KEY;

  const token = request.cookies.get("accessToken")?.value;

  const csrfHeader = request.headers.get("x-csrf-token");
  const csrfCookie = request.cookies.get("csrfToken")?.value;

  // CSRF check
  if (!csrfHeader || csrfHeader !== csrfCookie)
    return errorResponse("CSRF_MISMATCH", "CSRF mismatch. Not authorized", 403);

  if (!token) return errorResponse("NO_TOKEN", "No token. Not authorized", 401);
  console.log("params.prompt---", params.prompt);
  console.log("params.content---", params.content);

  try {
    const payload = verifyAccessToken(token);
    console.log("Access token payload:-------------------- ", payload);
    if (!payload) {
      return errorResponse(
        "INVALID_TOKEN",
        "Access Token Invalid. Not authorized",
        401
      );
    }

    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: apiKey,
    });

    const completion = await openai.chat.completions.create({
      // model: "deepseek/deepseek-r1-0528-qwen3-8b:free",
      model: "deepseek/deepseek-r1",
      messages: [
        { role: "system", content: params.prompt },
        { role: "user", content: params.content },
      ],

      temperature: 0,
      // max_tokens: 4096,
      max_tokens: 1024, //4096,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    // const response = completion.choices;
    // return NextResponse.json(
    //   { success: true, data: { user } },
    //   { status: 200 }
    // );
    const response = completion.choices[0]?.message?.content || "";
    console.log("response-----", response);
    // return NextResponse.json(completion);
    return NextResponse.json(response);
  } catch (err) {
    console.log("err-----", err);
    return errorResponse(
      "INVALID_TOKEN",
      "Invalid token. Token verification failed" + err,
      401
    );
  }

  // const response = completion.choices[0].message;
  // const response = completion.choices[0].message.content;
  // console.log("******s", response[0].message.content);

  // const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //     Authorization: `Bearer ${apiKey}`,
  //   },
  //   body: JSON.stringify({
  //     model: "deepseek/deepseek-r1-0528-qwen3-8b:free",
  //     messages: [
  //       { role: "system", content: params.prompt },
  //       { role: "user", content: params.content },
  //     ],
  //     temperature: 0,
  //     max_tokens: 1024,
  //     top_p: 1,
  //     frequency_penalty: 0,
  //     presence_penalty: 0,
  //   }),
  // });
}
// import { NextRequest, NextResponse } from "next/server";
// import OpenAI from "openai";

// export async function POST(NextRequest) {
//   const openai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY,
//   });
//   const params = await NextRequest.json();
//   const response = await openai.chat.completions.create({
//     //model: "gpt-3.5-turbo",
//     model: "gpt-4o-mini",
//     messages: [
//       {
//         role: "system",
//         content: params.prompt,
//       },
//       {
//         role: "user",
//         content: params.content,
//       },
//     ],
//     temperature: 0,
//     max_tokens: 1024,
//     top_p: 1,
//     frequency_penalty: 0,
//     presence_penalty: 0,
//     //stream: true,
//   });
//   return NextResponse.json(response);
// }
