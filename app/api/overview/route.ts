import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import MockTestAttempt from "@/models/Attempt";
import Question from "@/models/question";

export async function GET() {
  await connectDB();

  /* ================= AUTH ================= */
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const userId = session.user.id;

  /* ================= FETCH ATTEMPTS ================= */
  const attempts = await MockTestAttempt.find({
    userId,
    status: "completed",
  }).lean();

  if (!attempts.length) {
    return NextResponse.json({
      totalAttempts: 0,
      averageScore: 0,
      bestScore: 0,
      weakSubject: "N/A",
    });
  }

  /* ================= BASIC STATS ================= */
  const totalAttempts = attempts.length;
  const scores = attempts.map(a => a.score ?? 0);

  const averageScore = Math.round(
    scores.reduce((a, b) => a + b, 0) / scores.length
  );

  const bestScore = Math.max(...scores);

  /* ================= COLLECT QUESTION IDS ================= */
  const questionIds = attempts.flatMap(a =>
    a.questions.map((q: { questionId: any; }) => q.questionId)
  );

  const questions = await Question.find(
    { _id: { $in: questionIds } },
    { subject: 1 }
  ).lean();

  const questionSubjectMap = new Map(
    questions.map(q => [q._id.toString(), q.subject])
  );

  /* ================= WEAK SUBJECT ================= */
  const subjectStats: Record<
    string,
    { correct: number; total: number }
  > = {};

  for (const attempt of attempts) {
    const answers = attempt.answers || {};

    for (const q of attempt.questions) {
      const qId = q.questionId.toString();
      const subject = questionSubjectMap.get(qId);
      if (!subject) continue;

      if (!subjectStats[subject]) {
        subjectStats[subject] = { correct: 0, total: 0 };
      }

      subjectStats[subject].total += 1;

      const userAnswer =
        answers instanceof Map ? answers.get(qId) : answers[qId];

      if (userAnswer === q.correctAnswer) {
        subjectStats[subject].correct += 1;
      }
    }
  }

  let weakSubject = "N/A";
  let lowestAccuracy = 101;

  for (const [subject, data] of Object.entries(subjectStats)) {
    if (data.total === 0) continue;

    const accuracy = (data.correct / data.total) * 100;

    if (accuracy < lowestAccuracy) {
      lowestAccuracy = accuracy;
      weakSubject = subject;
    }
  }

  /* ================= RESPONSE ================= */
  return NextResponse.json({
    totalAttempts,
    averageScore, // number (frontend formats %)
    bestScore,
    weakSubject,
  });
}
