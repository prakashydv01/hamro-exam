import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import MockTestAttempt from "@/models/Attempt";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;

  const { attemptId, answers } = await req.json();

  if (!attemptId) {
    return NextResponse.json({ error: "Attempt ID required" }, { status: 400 });
  }

  await connectDB();

  /* ================= OWNERSHIP CHECK ================= */
  // Without this, anyone who knows/guesses an attemptId could submit or
  // rescore someone else's test.
  const ownsAttempt = await MockTestAttempt.exists({ _id: attemptId, userId });
  if (!ownsAttempt) {
    return NextResponse.json(
      { error: "Attempt not found or unauthorized" },
      { status: 404 }
    );
  }

  /* ================= CONVERT ANSWERS TO NUMBER FORMAT ================= */
  const convertedAnswers: Record<string, number> = {};

  if (answers && typeof answers === "object") {
    Object.entries(answers).forEach(([questionId, answer]) => {
      if (typeof answer === "string") {
        const letterToNumber: Record<string, number> = {
          A: 0,
          B: 1,
          C: 2,
          D: 3,
        };
        convertedAnswers[questionId] = letterToNumber[answer] ?? -1;
      } else if (typeof answer === "number") {
        convertedAnswers[questionId] = answer;
      }
    });
  }

  /* ================= FIRST, SAVE ANSWERS ================= */
  if (Object.keys(convertedAnswers).length > 0) {
    await MockTestAttempt.findOneAndUpdate(
      { _id: attemptId, userId },
      { answers: convertedAnswers }
    );
  }

  /* ================= FIND ATTEMPT ================= */
  const attempt = await MockTestAttempt.findOne({ _id: attemptId, userId }).lean();

  if (!attempt) {
    return NextResponse.json({ error: "Attempt not found" }, { status: 404 });
  }

  /* ================= CALCULATE RESULT WITH NEGATIVE MARKING ================= */
  let correct = 0;
  let wrong = 0;

  const finalAnswers = convertedAnswers || attempt.answers || {};

  for (const q of attempt.questions) {
    const qId = q.questionId.toString();
    const userAnswerIndex = finalAnswers[qId];

    const correctAnswer = q.correctAnswer;

    let correctAnswerIndex: number;

    if (typeof correctAnswer === "string") {
      if (correctAnswer.match(/^[0-9]+$/)) {
        correctAnswerIndex = parseInt(correctAnswer, 10);
      } else {
        const letterToNumber: Record<string, number> = {
          A: 0,
          B: 1,
          C: 2,
          D: 3,
        };
        correctAnswerIndex = letterToNumber[correctAnswer] ?? -1;
      }
    } else if (typeof correctAnswer === "number") {
      correctAnswerIndex = correctAnswer;
    } else {
      correctAnswerIndex = -1;
    }

    if (userAnswerIndex !== undefined && userAnswerIndex !== -1 && userAnswerIndex !== null) {
      if (userAnswerIndex === correctAnswerIndex) {
        correct++;
      } else {
        wrong++;
      }
    }
  }

  const total = attempt.questions.length;

  /* ================= NEGATIVE MARKING CALCULATION ================= */
  let score = correct * 1;

  if (attempt.negativeMarking?.enabled) {
    const negative = wrong * attempt.negativeMarking.perWrong;
    score = score - negative;
    if (score < 0) score = 0;
  }

  const percentage = total ? Number(((score / total) * 100).toFixed(1)) : 0;

  const accuracy =
    correct + wrong > 0 ? Math.round((correct / (correct + wrong)) * 100) : 0;

  const unattempted = total - (correct + wrong);

  /* ================= UPDATE ATTEMPT ================= */
  await MockTestAttempt.findOneAndUpdate(
    { _id: attemptId, userId },
    {
      status: "completed",
      score,
      correctAnswers: correct,
      wrongAnswers: wrong,
      unattemptedAnswers: unattempted,
      percentage,
      accuracy,
      negativeMarksApplied: attempt.negativeMarking?.enabled
        ? wrong * attempt.negativeMarking.perWrong
        : 0,
      completedAt: new Date(),
    }
  );

  /* ================= RESPONSE ================= */
  return NextResponse.json({
    attemptId,
    total,
    correct,
    wrong,
    unattempted,
    score: Number(score.toFixed(1)),
    percentage,
    accuracy,
    negativeMarking: {
      enabled: attempt.negativeMarking?.enabled || false,
      perWrong: attempt.negativeMarking?.perWrong || 0,
      applied: attempt.negativeMarking?.enabled
        ? Number((wrong * attempt.negativeMarking.perWrong).toFixed(1))
        : 0,
    },
  });
}