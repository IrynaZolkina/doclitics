import clientPromise from "@/lib/mongodb/mongodb";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function monthKeyKyiv(date = new Date()) {
  // Kyiv time month key (avoids “month rollover” surprises for your users)
  const kyiv = new Date(
    date.toLocaleString("en-US", { timeZone: "Europe/Kyiv" }),
  );
  const y = kyiv.getFullYear();
  const m = String(kyiv.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

export async function GET(req) {
  // Simple auth for cron route
  const secret = req.headers.get("authorization");
  if (
    !process.env.CRON_SECRET ||
    secret !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  const client = await clientPromise;
  const db = client.db("doclitic");
  const users = db.collection("users");

  const key = monthKeyKyiv(); // e.g. "2026-02"

  // Reset only users on Free who haven't been reset this month
  const res = await users.updateMany(
    {
      plan: "free",
      $or: [
        { freeResetMonth: { $ne: key } },
        { freeResetMonth: { $exists: false } },
      ],
    },
    {
      $set: {
        docsAmount: 3,
        freeResetMonth: key,
        freeResetAt: new Date(),
        updatedAt: new Date(),
      },
    },
  );

  return NextResponse.json({
    ok: true,
    month: key,
    matched: res.matchedCount,
    modified: res.modifiedCount,
  });
}
