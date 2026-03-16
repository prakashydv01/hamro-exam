import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import MockTestAttempt from "@/models/Attempt";
import mongoose from "mongoose";

export async function POST(req: Request) {
  // Session check removed - now public
  const { attemptId, answers } = await req.json();

  if (!attemptId) {
    return NextResponse.json({ error: "Attempt ID required" }, { status: 400 });
  }

  await connectDB();

  /* ================= CONVERT ANSWERS TO NUMBER FORMAT ================= */
  // Handle both letter answers (A, B, C, D) and number indices (0, 1, 2, 3)
  const convertedAnswers: Record<string, number> = {};
  
  if (answers && typeof answers === 'object') {
    Object.entries(answers).forEach(([questionId, answer]) => {
      if (typeof answer === 'string') {
        // Convert "A" to 0, "B" to 1, "C" to 2, "D" to 3 (for backward compatibility)
        const letterToNumber: Record<string, number> = {
          'A': 0,
          'B': 1,
          'C': 2,
          'D': 3
        };
        convertedAnswers[questionId] = letterToNumber[answer] ?? -1;
      } else if (typeof answer === 'number') {
        // Already a number (preferred format)
        convertedAnswers[questionId] = answer;
      }
    });
  }

  /* ================= FIRST, SAVE ANSWERS ================= */
  if (Object.keys(convertedAnswers).length > 0) {
    await MockTestAttempt.findByIdAndUpdate(attemptId, {
      answers: convertedAnswers,
    });
  }

  /* ================= FIND ATTEMPT ================= */
  // Find attempt by ID only (no userId check for public access)
  const attempt = await MockTestAttempt.findById(attemptId).lean();

  if (!attempt) {
    return NextResponse.json({ error: "Attempt not found" }, { status: 404 });
  }

  /* ================= CALCULATE RESULT WITH NEGATIVE MARKING ================= */
  let correct = 0;
  let wrong = 0;

  // Use the newly saved answers or existing ones
  const finalAnswers = convertedAnswers || attempt.answers || {};

  for (const q of attempt.questions) {
    const qId = q.questionId.toString();
    const userAnswerIndex = finalAnswers[qId];
    
    // Get the correct answer - could be stored as number index or letter
    const correctAnswer = q.correctAnswer;
    
    let correctAnswerIndex: number;
    
    if (typeof correctAnswer === 'string') {
      if (correctAnswer.match(/^[0-9]+$/)) {
        // If it's a numeric string like "3"
        correctAnswerIndex = parseInt(correctAnswer, 10);
      } else {
        // If it's a letter like "D"
        const letterToNumber: Record<string, number> = {
          'A': 0, 'B': 1, 'C': 2, 'D': 3
        };
        correctAnswerIndex = letterToNumber[correctAnswer] ?? -1;
      }
    } else if (typeof correctAnswer === 'number') {
      // Already a number
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
  let score = correct * 1; // 1 mark per correct

  if (attempt.negativeMarking?.enabled) {
    const negative = wrong * attempt.negativeMarking.perWrong;
    score = score - negative;
    if (score < 0) score = 0; // safety: prevent negative scores
  }

  const percentage = total ? Number(((score / total) * 100).toFixed(1)) : 0;
  
  const accuracy =
    correct + wrong > 0
      ? Math.round((correct / (correct + wrong)) * 100)
      : 0;

  const unattempted = total - (correct + wrong);

  /* ================= UPDATE ATTEMPT ================= */
  await MockTestAttempt.findByIdAndUpdate(attemptId, {
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
  });

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