import { connectDB } from "@/lib/mongodb";
import MockTestConfig from "@/models/MockTestConfig";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    if (!body.faculty || !body.totalQuestions || !body.durationMinutes) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const config = await MockTestConfig.create(body);

    return NextResponse.json(config, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
