import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request) {
  const params = await request.json();
  const apiKey = process.env.DEEPSEEK_API_KEY;
  console.log("params.prompt---", params.prompt);
  console.log("params.content---", params.content);
  const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: apiKey,
  });

  const completion = await openai.chat.completions.create({
    model: "deepseek/deepseek-r1-0528-qwen3-8b:free",
    messages: [
      { role: "system", content: params.prompt },
      { role: "user", content: params.content },
    ],

    temperature: 0,
    max_tokens: 4096,
    // max_tokens: 1024, //4096,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });

  const response = completion.choices;
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

  console.log("response-----", response);
  return NextResponse.json(response);
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
