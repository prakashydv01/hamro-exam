import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";

import MockTestConfig from "@/models/MockTestConfig";
import Question from "@/models/question";
import MockTestAttempt from "@/models/Attempt";

/* ================= GET: AVAILABLE MOCK TESTS ================= */
export async function GET() {
  try {
    await connectDB();
    const configs = await MockTestConfig.find({}).lean();
    return NextResponse.json(configs);
  } catch (error) {
    console.error("Error fetching mock tests:", error);
    return NextResponse.json(
      { error: "Failed to fetch mock tests" },
      { status: 500 }
    );
  }
}

/* ================= POST: START MOCK TEST ================= */
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { faculty, selectedGroups } = await req.json();

    if (!faculty) {
      return NextResponse.json({ error: "Faculty required" }, { status: 400 });
    }

    await connectDB();

    const config = await MockTestConfig.findOne({ faculty }).lean();
    if (!config) {
      return NextResponse.json(
        { error: "Mock test not configured for this faculty" },
        { status: 404 }
      );
    }

    let questions: any[] = [];

    for (const rule of config.subjectRules || []) {
      let include = false;

      if (rule.compulsory) include = true;

      if (
        rule.group &&
        selectedGroups &&
        selectedGroups[rule.group] === rule.subject
      ) {
        include = true;
      }

      if (!include) continue;

      const sampled = await Question.aggregate([
        {
          $match: {
            faculty,
            subject: rule.subject,
          },
        },
        { $sample: { size: rule.count } },
        {
          $project: {
            question: 1,
            options: 1,
            correctAnswer: 1,
          },
        },
      ]);

      questions.push(...sampled);
    }

    questions = questions.slice(0, config.totalQuestions);

    if (!questions.length) {
      return NextResponse.json(
        { error: "No questions available for this test" },
        { status: 404 }
      );
    }

    const negativeMarkingConfig = {
      enabled: config.negativeMarking?.enabled === true,
      perWrong:
        typeof config.negativeMarking?.perWrong === "number"
          ? Math.max(0, config.negativeMarking.perWrong)
          : 0,
    };

    const attempt = await MockTestAttempt.create({
      userId: session.user.id,
      faculty,
      negativeMarking: negativeMarkingConfig,
      questions: questions.map((q) => ({
        questionId: q._id,
        correctAnswer: Number(q.correctAnswer), // ensure number
      })),
      answers: {},
      startedAt: new Date(),
      status: "in-progress",
    });

    return NextResponse.json({
      attemptId: attempt._id,
      faculty,
      durationMinutes: config.durationMinutes,
      totalQuestions: questions.length,
      questions: questions.map((q) => ({
        _id: q._id,
        question: q.question,
        options: q.options,
        correctAnswer: Number(q.correctAnswer), // 👈 CRITICAL: Send correctAnswer!
    subject: q.subject, // 👈 Also send subject for subject-wise analysis
      })),
      negativeMarking: negativeMarkingConfig,
    });
  } catch (error) {
    console.error("Error starting mock test:", error);
    return NextResponse.json(
      { error: "Failed to start mock test" },
      { status: 500 }
    );
  }
}

/* ================= PUT: SAVE ANSWERS ================= */
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { attemptId, answers } = await req.json();

    if (!attemptId || !answers) {
      return NextResponse.json(
        { error: "Attempt ID and answers are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const attempt = await MockTestAttempt.findOne({
      _id: attemptId,
      userId: session.user.id,
    });

    if (!attempt) {
      return NextResponse.json(
        { error: "Attempt not found or unauthorized" },
        { status: 404 }
      );
    }

    attempt.answers = answers;
    await attempt.save();

    return NextResponse.json({
      success: true,
      message: "Answers saved successfully",
    });
  } catch (error) {
    console.error("Error saving answers:", error);
    return NextResponse.json(
      { error: "Failed to save answers" },
      { status: 500 }
    );
  }
}

/* ================= PATCH: COMPLETE TEST ================= */
export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { attemptId } = await req.json();

    if (!attemptId) {
      return NextResponse.json(
        { error: "Attempt ID is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const attempt = await MockTestAttempt.findOne({
      _id: attemptId,
      userId: session.user.id,
    });

    if (!attempt) {
      return NextResponse.json(
        { error: "Attempt not found or unauthorized" },
        { status: 404 }
      );
    }

    if (attempt.status === "completed") {
      return NextResponse.json(
        { error: "Test already completed" },
        { status: 400 }
      );
    }

    const scoreDetails = calculateScoreWithNegativeMarking(
      attempt.questions,
      attempt.answers,
      attempt.negativeMarking
    );

    attempt.status = "completed";
    attempt.completedAt = new Date();
    attempt.score = scoreDetails.totalScore;
    attempt.correctCount = scoreDetails.correct;
    attempt.wrongCount = scoreDetails.wrong;
    attempt.unattemptedCount = scoreDetails.unattempted;

    await attempt.save();

    return NextResponse.json({
      success: true,
      results: scoreDetails,
    });
  } catch (error) {
    console.error("Error completing test:", error);
    return NextResponse.json(
      { error: "Failed to complete test" },
      { status: 500 }
    );
  }
}

/* ================= GET: TEST RESULTS ================= */
export async function GET_RESULTS(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const attemptId = searchParams.get("attemptId");

    if (!attemptId) {
      return NextResponse.json(
        { error: "Attempt ID is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const attempt = await MockTestAttempt.findOne({
      _id: attemptId,
      userId: session.user.id,
    }).populate("questions.questionId", "question options correctAnswer");

    if (!attempt) {
      return NextResponse.json(
        { error: "Attempt not found" },
        { status: 404 }
      );
    }

    const questionDetails = attempt.questions.map((q: any, index: number) => {
      const qId = q.questionId._id.toString();
      const userAnswer = attempt.answers[qId];

      const isCorrect =
        userAnswer !== undefined &&
        Number(userAnswer) === Number(q.correctAnswer);

      return {
        questionNumber: index + 1,
        question: q.questionId?.question,
        userAnswer:
          userAnswer !== undefined ? userAnswer : "Not attempted",
        correctAnswer: q.correctAnswer,
        isCorrect,
        isAttempted: userAnswer !== undefined,
        options: q.questionId?.options,
      };
    });

    return NextResponse.json({
      attemptId: attempt._id,
      faculty: attempt.faculty,
      startedAt: attempt.startedAt,
      completedAt: attempt.completedAt,
      status: attempt.status,
      results: {
        totalScore: attempt.score,
        correct: attempt.correctCount,
        wrong: attempt.wrongCount,
        unattempted: attempt.unattemptedCount,
        negativeMarking: attempt.negativeMarking,
      },
      questions: questionDetails,
    });
  } catch (error) {
    console.error("Error fetching results:", error);
    return NextResponse.json(
      { error: "Failed to fetch results" },
      { status: 500 }
    );
  }
}

/* ================= HELPER FUNCTION ================= */
function calculateScoreWithNegativeMarking(
  questions: Array<{ questionId: any; correctAnswer: number }>,
  answers: Record<string, number>,
  negativeMarking: { enabled: boolean; perWrong: number }
) {
  let correct = 0;
  let wrong = 0;
  let unattempted = 0;

  questions.forEach((question) => {
    const qId = question.questionId.toString();
    const answer = answers[qId];

    if (answer === undefined || answer === null) {
      unattempted++;
    } else if (Number(answer) === Number(question.correctAnswer)) {
      correct++;
    } else {
      wrong++;
    }
  });

  let totalScore = correct;

  if (negativeMarking.enabled && negativeMarking.perWrong > 0) {
    totalScore -= wrong * negativeMarking.perWrong;
  }

  totalScore = Math.max(0, totalScore);

  return {
    totalScore,
    correct,
    wrong,
    unattempted,
    rawScore: correct,
    negativeMarksApplied:
      negativeMarking.enabled ? wrong * negativeMarking.perWrong : 0,
  };
}