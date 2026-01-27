// right route

import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import {
  getPendingUsersCollection,
  getUserCollection,
  getVerificationCollection,
} from "@/lib/mongodb/mongodb";
import { createUser } from "@/lib/mongodb/createUser";

const ATTEMPTS_LIMIT = 3;

export async function POST(req) {
  const { email, code } = await req.json();
  console.log(email, code, "--------- email, code");
  try {
    if (!email || !code) {
      return NextResponse.json(
        { error: "Email and code required" },
        { status: 400 }
      );
    }

    const verifications = await getVerificationCollection();

    // Find verification record
    const record = await verifications.findOne({ email });
    console.log(record, "---------record");
    // 1. No record found (expired or wrong email)
    if (!record) {
      return NextResponse.json(
        { code: "CODE_EXPIRED", message: "Code expired or not found" },
        { status: 400 }
      );
    }
    // Check attempts
    if (record.attempts >= ATTEMPTS_LIMIT) {
      await verifications.deleteOne({ email });
      await getPendingUsersCollection().then((col) => col.deleteOne({ email }));
      return NextResponse.json(
        { code: "TOO_MANY_ATTEMPTS", message: "Too many wrong attempts" },
        { status: 400 }
      );
    }

    // 2. Check attempts (max 5)
    // if (record.attempts >= 3) {
    //   await pendingUsers.deleteOne({ email });
    //   await verifications.deleteOne({ email });
    //   return NextResponse.json(
    //     { code: "TOO_MANY_ATTEMPTS", message: "Too many wrong attempts" },
    //     { status: 400 }
    //   );
    // }
    // 3. Wrong code → increment attempts

    // Compare provided code with stored hash
    const match = await bcrypt.compare(code, record.codeHash);
    console.log(match, "---------match");
    if (!match) {
      // return NextResponse.json({ error: "Invalid code" }, { status: 400 });
      // }
      // if (record.code !== code) {
      await verifications.updateOne({ email }, { $inc: { attempts: 1 } });

      const remaining = ATTEMPTS_LIMIT - (record.attempts + 1);
      if (remaining === 0) {
        await pendingUsers.deleteOne({ email });
        await verifications.deleteOne({ email });
        return NextResponse.json(
          { code: "TOO_MANY_ATTEMPTS", message: "Too many wrong attempts" },
          { status: 400 }
        );
      }

      return NextResponse.json(
        {
          code: "INVALID_CODE",
          message: `Wrong code. ${remaining} attempts left.`,
          remainingAttempts: remaining,
        },
        { status: 400 }
      );
    }
    if (record.expiresAt < new Date()) {
      return NextResponse.json(
        { code: "CODE_EXPIRED", message: "Code expired" },
        { status: 400 }
      );
    }
    // 4. Success → move pendingUser to users
    const pendingUsers = await getPendingUsersCollection();
    const pendingUser = await pendingUsers.findOne({ email });
    if (!pendingUser) {
      return NextResponse.json(
        { code: "USER_NOT_FOUND", message: "Pending user not found" },
        { status: 400 }
      );
    }

    // Activate user by calling createUser (same schema)
    await createUser({ ...pendingUser, verified: true });

    // Copy all fields except _id
    // const { _id, ...userData } = pendingUser;

    // const users = await getUserCollection();

    // await users.insertOne({
    //   ...userData,
    //   // verified: true,
    //   createdAt: new Date(),
    // });

    // Check expiration
    // if (record.expiresAt < Date.now()) {
    //   await verifications.deleteMany({ email }); // clean up
    //   return NextResponse.json({ error: "Code expired" }, { status: 400 });
    // }

    // Mark user as verified
    // await users.updateOne({ email }, { $set: { verified: true } });

    // Delete all verification codes for that email
    // await verifications.deleteMany({ email });
    // Cleanup
    await pendingUsers.deleteOne({ email });
    await verifications.deleteOne({ email });

    return NextResponse.json({ success: true }, { status: 200 });
    // return NextResponse.json({ message: "Email verified successfully" });
  } catch (err) {
    console.error("Verify error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
