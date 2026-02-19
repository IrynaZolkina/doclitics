import clientPromise from "@/lib/mongodb/mongodb";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function monthKeyKyiv(date = new Date()) {
  const kyiv = new Date(
    date.toLocaleString("en-US", { timeZone: "Europe/Kyiv" }),
  );
  const y = kyiv.getFullYear();
  const m = String(kyiv.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

export async function GET(req) {
  try {
    // ✅ Auth via query param (because vercel.json cron doesn't allow headers)
    const { searchParams } = new URL(req.url);
    const key = searchParams.get("key");

    if (!process.env.CRON_SECRET || key !== process.env.CRON_SECRET) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const client = await clientPromise;
    const db = client.db("doclitic");
    const users = db.collection("users");

    const monthKey = monthKeyKyiv(); // e.g. "2026-02"

    // ✅ Reset only "free" users once per month
    const res = await users.updateMany(
      {
        plan: "free",
        $or: [
          { freeResetMonth: { $ne: monthKey } },
          { freeResetMonth: { $exists: false } },
        ],
      },
      {
        $set: {
          docsAmount: 3,
          freeResetMonth: monthKey,
          freeResetAt: new Date(),
          updatedAt: new Date(),
        },
      },
    );

    return NextResponse.json({
      ok: true,
      month: monthKey,
      matched: res.matchedCount,
      modified: res.modifiedCount,
    });
  } catch (err) {
    console.error("CRON free-reset error:", err);
    return NextResponse.json(
      { ok: false, error: "Server error" },
      { status: 500 },
    );
  }
}
