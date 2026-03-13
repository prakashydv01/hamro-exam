import { connectDB } from "@/lib/mongodb";
import Question from "@/models/question";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDB();

    const contentType = req.headers.get("content-type") || "";

    // ===============================
    // 1️⃣ BULK JSON FILE UPLOAD
    // ===============================
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File;

      if (!file) {
        return NextResponse.json(
          { error: "JSON file missing" },
          { status: 400 }
        );
      }

      const text = await file.text();
      const questions = JSON.parse(text);

      if (!Array.isArray(questions)) {
        return NextResponse.json(
          { error: "JSON must be an array" },
          { status: 400 }
        );
      }

      // Basic validation for each question
      for (const q of questions) {
        if (
          !q.question ||
          !q.options ||
          q.correctAnswer === undefined ||
          !q.faculty ||
          !q.subject
        ) {
          return NextResponse.json(
            { error: "Invalid question format in JSON file" },
            { status: 400 }
          );
        }
      }

      await Question.insertMany(questions);

      return NextResponse.json(
        { success: true, count: questions.length },
        { status: 201 }
      );
    }

    // ===============================
    // 2️⃣ SINGLE QUESTION JSON
    // ===============================
    const body = await req.json();

    if (
      !body.question ||
      !body.options ||
      body.correctAnswer === undefined ||
      !body.faculty ||
      !body.subject
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const question = await Question.create(body);

    return NextResponse.json(question, { status: 201 });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to add question" },
      { status: 500 }
    );
  }
}
