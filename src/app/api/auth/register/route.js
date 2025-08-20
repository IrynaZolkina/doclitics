import { getCollection } from "@/lib/db";
import { NextResponse } from "next/server";

import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import { sendActivationMail } from "@/actions/mailservice";
import { generateTokens, saveTokenToDB } from "@/actions/tokenservice";
import {
  validateEmail,
  validatePassword,
  validateUserName,
} from "@/actions/userservice";
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

    const errors = {
      username: validateUserName(username),
      email: validateEmail(email),
      // password: validatePassword(password),
    };

    // const isValid = !errors.username && !errors.email && !errors.password;

    // if (!isValid) {
    //   return res.status(400).json({ error: "errors" });
    // }

    const userCollection = await getCollection("users");

    //await userCollection.createIndex({ email: 1 }, { unique: true });

    // Check if email exists
    const candidate = await userCollection.findOne({ email: email });

    if (candidate) {
      console.log(`User already exists ${email}---`);
      return NextResponse.json(
        // { message: "Email already registered" }
        { error: `Email already registered ${email}` },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 3);
    const activationLink = uuidv4();
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const result = await userCollection.insertOne({
      username,
      email,
      password: hashedPassword,
      verificationCode,
      isActivated: false,
      activationExpires: new Date(Date.now() + 10 * 60 * 1000),
      createdAt: new Date(),
    });

    const userDto = {
      userId: result.insertedId,
      username,
      email,
    };
    console.log("userDt-------o", userDto);

    const tokens = await generateTokens({ ...userDto });
    console.log(".accessToken-------", tokens.accessToken);
    console.log(".refreshToken-------", tokens.refreshToken);

    saveTokenToDB(userDto.userId, tokens.refreshToken);

    await sendActivationMail(
      email,
      //   `${process.env.API_URL}/api/auth/link/${activationLink}`
      verificationCode
    );

    // Create JSON response
    const response = NextResponse.json({
      message:
        "Registration successful. Check your email to activate your account. Link will be active during 10 min.",
      userDto,
      accessToken: tokens.accessToken,
    });

    // Set HTTP-only cookie for refresh token
    response.cookies.set("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    return response;

    // return NextResponse.json({
    //   message:
    //     "Registration successful. Check your email to activate your account. Link will be active during 10 min.",
    //   userDto,...tokens
    // });
  } catch (err) {
    console.error(err);
    // return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
