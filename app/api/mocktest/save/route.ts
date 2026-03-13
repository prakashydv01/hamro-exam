import  MockTestAttempt  from "@/models/Attempt";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { attemptId, questionId, answer } = await req.json();

  await MockTestAttempt.findByIdAndUpdate(attemptId, {
    $set: { [`answers.${questionId}`]: answer },
  });

  return NextResponse.json({ success: true });
}
