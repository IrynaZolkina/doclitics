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
import { redirect } from "next/navigation";
// import clientPromise from "@/lib/mongodb";
// import bcrypt from "bcryptjs";
// import nodemailer from "nodemailer";
// import { randomUUID } from "crypto";

export async function POST(req) {
  try {
    const { code, enteredEmail } = await req.json();
    console.log(code, enteredEmail, typeof code);
    if (!code || !enteredEmail) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const users = await getCollection("users");

    const user = await users.findOne({
      verificationCode: code,

      //   isActivated: false,
    });

    //await userCollection.createIndex({ email: 1 }, { unique: true });

    // Check if email exists
    if (!user) {
      return NextResponse.json({ error: "user not found" }, { status: 400 });
    }

    if (new Date() > user.activationExpires) {
      await users.deleteOne({ _id: user._id });
      // redirect("/login?error=expired_token");
      // return NextResponse.json(
      //   { error: "Activation link expired" },
      //   { status: 400 }
      // );
    }

    const result = await users.updateOne(
      { _id: user._id },
      {
        $set: {
          isActivated: true,
        },
        $unset: {
          activationLink: "",
          activationExpires: "",
          verificationCode: "",
        },
      }
    );
    if (result.modifiedCount === 1) {
      console.log("User activated successfully");
    } else {
      console.log("No changes made");
    }

    const response = NextResponse.json({
      message: "Activation successful. ",
      result,
    });

    return response;

    //redirect("/login?registered=1");

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
