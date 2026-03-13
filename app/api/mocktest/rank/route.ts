import { NextResponse } from "next/server";
import MockTestAttempt from "@/models/Attempt";

export async function GET() {
  const ranks = await MockTestAttempt.find({ status: "completed" })
    .sort({ score: -1 })
    .limit(10)
    .populate("userId", "name");

  return NextResponse.json({ ranks });
}
