import { NextResponse } from "next/server";
import {connectDB} from "@/lib/mongodb";
import Attempt from "@/models/Attempt";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: { json: () => any; }) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const {
      questionId,
      selectedOption,
      correct,
      faculty,
      subject,
      type
    } = body;

    if (!questionId || type === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const attempt = await Attempt.create({
      userId: session.user.id,
      questionId,
      selectedOption,
      correct,
      faculty,
      subject,
      type
    });

    return NextResponse.json({ success: true, attempt });
  } catch (error) {
    console.error("Attempt Error:", error);
    return NextResponse.json(
      { error: "Failed to save attempt" },
      { status: 500 }
    );
  }
}
