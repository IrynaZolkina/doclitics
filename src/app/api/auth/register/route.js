import { getCollection } from "@/lib/db";
import { NextResponse } from "next/server";

import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import { sendActivationMail } from "@/actions/mailservice";
// import clientPromise from "@/lib/mongodb";
// import bcrypt from "bcryptjs";
// import nodemailer from "nodemailer";
// import { randomUUID } from "crypto";

export async function POST(req) {
  try {
    const { username, email, password } = await req.json();
    console.log(username, email, password);
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }
    const userCollection = await getCollection("users");
    // const client = await clientPromise;
    // const db = client.db();
    // const users = db.collection("users");

    // // Check if email exists
    // const existing = await users.findOne({ email });
    // if (existing) {
    //   return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    // }
    const candidate = await userCollection.findOne({ email: email });
    // console.log("candidate---", candidate);
    if (candidate) {
      console.log(`User already exists ${email}---`);
      //   return NextResponse.json(
      //     { error: "Email already registered" },
      //     { status: 400 }
      //   );
    }

    // const hashedPassword = await bcrypt.hash(password, 10);
    // const activationLink = randomUUID();
    const hashedPassword = await bcrypt.hash(password, 3);
    const activationLink = uuidv4();

    const result = await userCollection.insertOne({
      email,
      password: hashedPassword,
      activationLink,
      isActivated: false,
      activationLink,
      activationExpires: new Date(Date.now() + 10 * 60 * 1000),
      createdAt: new Date(),
    });
    // await users.insertOne({
    //   username,
    //   email,
    //   password: hashedPassword,
    //   isActivated: false,
    //   activationLink,
    //   activationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h
    //   createdAt: new Date(),
    // });
    await sendActivationMail(
      email,
      //   `${process.env.API_URL}/api/auth/link/${activationLink}`
      `${process.env.API_URL}/activated/${activationLink}`
    );
    // Send email
    // const transporter = nodemailer.createTransport({
    //   service: "gmail",
    //   auth: {
    //     user: process.env.SMTP_USER,
    //     pass: process.env.SMTP_PASS, // App password
    //   },
    // });

    // const activationUrl = `${process.env.API_URL}/api/activate/${activationLink}`;

    // await transporter.sendMail({
    //   from: process.env.SMTP_USER,
    //   to: email,
    //   subject: "Account Activation",
    //   html: `
    //     <div>
    //       <h1>Activate Your Account</h1>
    //       <p>Click the link below to activate your account:</p>
    //       <a href="${activationUrl}">${activationUrl}</a>
    //       <p>This link will expire in 24 hours.</p>
    //     </div>
    //   `,
    // });

    return NextResponse.json({
      message:
        "Registration successful. Check your email to activate your account. Link will be active during 10 min.",
    });
  } catch (err) {
    console.error(err);
    // return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
