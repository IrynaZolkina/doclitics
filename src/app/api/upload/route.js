// app/api/upload/route.js
import { getCollection } from "@/lib/db";
import { MongoClient, Binary } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file"); // Blob (from <input type="file">)
    // console.log("typeof file:", typeof file);
    // console.log("constructor:", file?.constructor?.name);
    // console.log("is Blob:", file instanceof Blob);
    // console.log("value:", file);
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert File → Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Connect to MongoDB
    // const client = new MongoClient(process.env.MONGO_URL);
    // await client.connect();
    // const db = client.db("mydb");
    const client = new MongoClient(process.env.MONGODB_URL);
    await client.connect(); // ✅ must await
    const db = client.db("auth");
    const collection = db.collection("files"); // ✅ now it works

    // Save file
    const fileSaved = await collection.insertOne({
      filename: file.name,
      mimetype: file.type,
      size: file.size,
      data: new Binary(buffer),
      uploadedAt: new Date(),
    });

    // await client.close();

    return NextResponse.json({ success: true, fileSaved });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
