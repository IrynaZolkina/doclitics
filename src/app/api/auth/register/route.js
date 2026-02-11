// app/api/auth/register/route.js
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import {
  getPendingUsersCollection,
  getUserCollection,
  getVerificationCollection,
} from "@/lib/mongodb/mongodb";
// import { sendVerificationEmail } from "@/lib/email";
import { sendActivationMail } from "@/lib/mailservice";
import { createPendingUser } from "@/lib/mongodb/createPendingUser";

export async function POST(req) {
  try {
    const body = await req.json().catch(() => null); // parse safely
    if (!body) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 },
      );
    }
    const { email, username, password } = body;
    // console.log(
    //   "username: enteredUsername,email: enteredEmail.toLowerCase(),password: enteredPassword",
    //   username,
    //   email,
    //   password
    // );
    //jjvjgjghkhv
    // 2. Validate input
    if (!email || !password || !username) {
      return NextResponse.json(
        { error: "Username, Email and password are required" },
        { status: 400 },
      );
    }

    // 1. Check if email already exists in main users
    const users = await getUserCollection();
    if (await users.findOne({ email })) {
      return NextResponse.json(
        { error: "Email already registered", code: "EMAIL_EXISTS" },
        { status: 409 },
      );
    }

    // 2. Check if email already exists in pending users
    const pendingUsers = await getPendingUsersCollection();
    if (await pendingUsers.findOne({ email })) {
      return NextResponse.json(
        { error: "Email pending verification", code: "EMAIL_PENDING" },
        { status: 409 },
      );
    }

    // 2. Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // // 3. Create user (unverified)
    // const newUser = {
    //   email,
    //   username,
    //   passwordHash,
    //   category: "no",
    //   stripeCustomerId: "",
    //   docsAmount: 0,
    //   // verified: false,
    //   createdAt: new Date(),
    // };
    // Create pending user using helper
    const pendingUser = await createPendingUser({
      email,
      username,
      passwordHash,
      provider: "local",
    });

    // // const newUserAdded = await users.insertOne(newUser);
    // const newPendingUserAdded = await pendingusers.insertOne(newUser);
    // //console.log("newUserAdded", newUserAdded);

    // 4. Generate verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digits
    // 5. Hash the code before saving
    const codeHash = await bcrypt.hash(code, 10);
    // const codes = await getCollection("verificationCodes");
    console.log(`Verification code for ${email}: ${code}`);

    const verifications = await getVerificationCollection();
    // await verifications.insertOne({ email, code, expiresAt: new Date(Date.now() + 15*60*1000) });

    await verifications.insertOne({
      email,
      codeHash,
      attempts: 0,
      createdAt: new Date(),
      // expiresAt: Date.now() + 10 * 60 * 1000, // valid 10 min
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // valid for 10 min
    });

    //    6. Send code (for now, console.log)

    await sendActivationMail(email, code); // gfiufifiuyfiuyfitf

    return NextResponse.json({ message: "Verification code sent to email" });
  } catch (err) {
    console.error("error registr---------", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
