import { getCollection } from "@/lib/db";
import { NextResponse } from "next/server";

import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import { sendActivationMail } from "@/actions/mailservice";
import { generateTokens, saveTokenToDB } from "@/actions/tokenservice";

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    console.log(email, password);
    if (!email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const userCollection = await getCollection("users");
    // const client = await clientPromise;
    // const db = client.db();
    // const users = db.collection("users");

    // Check if email exists
    const user = await userCollection.findOne({ email: email });
    // console.log("candidate---", candidate);
    if (!user) {
      console.log(`User not found ${email}---`);
      return NextResponse.json({ error: "User not... found" }, { status: 400 });
    }

    const isPasswordsEqual = await bcrypt.compare(password, user.password);

    if (!isPasswordsEqual) {
      return NextResponse.json(
        { error: "Incorrect password" },
        { status: 400 }
      );
    }

    const userDto = {
      userId: user._id,
      username: user.username,
      email: user.email,
    };
    console.log("userDt-------o", userDto);

    const tokens = await generateTokens({ ...userDto });
    // console.log(".accessToken-------", tokens.accessToken);
    // console.log(".refreshToken-------", tokens.refreshToken);

    saveTokenToDB(userDto.userId, tokens.refreshToken);

    // Create JSON response
    const response = NextResponse.json({
      message: "Login successful. ",
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
