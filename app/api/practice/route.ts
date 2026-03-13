import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Question from "@/models/question";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const faculty = searchParams.get("faculty");
    const subject = searchParams.get("subject");

    /* ---------------- GET ALL FACULTIES ---------------- */
    if (!faculty) {
      const faculties = await Question.distinct("faculty");
      return NextResponse.json({
        success: true,
        data: faculties,
      });
    }

    /* ---------------- GET SUBJECTS BY FACULTY ---------------- */
    if (faculty && !subject) {
      const subjects = await Question.distinct("subject", { faculty });
      return NextResponse.json({
        success: true,
        data: subjects,
      });
    }

    /* ---------------- GET 50 RANDOM QUESTIONS ---------------- */
    if (faculty && subject) {
      const questions = await Question.aggregate([
        {
          $match: {
            faculty,
            subject,
          },
        },
        { $sample: { size: 50 } }, // 🔥 RANDOM 50
        {
          $project: {
            question: 1,
            options: 1,
            correctAnswer: 1,
            explanation: 1,
            faculty: 1,
            subject: 1,
          },
        },
      ]);

      return NextResponse.json({
        success: true,
        total: questions.length,
        data: questions,
      });
    }

    return NextResponse.json(
      { success: false, message: "Invalid request" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Practice API error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
