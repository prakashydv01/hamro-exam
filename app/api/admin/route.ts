import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import Question from "@/models/question";
import mongoose from "mongoose";



/* ================= GET ================= */
export async function GET(req: Request) {
  await connectDB();
  const { searchParams } = new URL(req.url);

  const type = searchParams.get("type");
  const page = Number(searchParams.get("page") || 1);
  const limit = 5;

  if (type === "questions") {
    const total = await Question.countDocuments();
    const questions = await Question.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: questions,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  }

  if (type === "users") {
    const users = await User.find({}, { password: 0 });
    return NextResponse.json({ success: true, data: users });
  }

  return NextResponse.json({ error: "Invalid type" }, { status: 400 });
}

/* ================= POST ================= */
export async function POST(req: Request) {
  await connectDB();
  const { action, data } = await req.json();

  /* ADD QUESTION */
  if (action === "addQuestion") {
    const q = await Question.create(data);
    return NextResponse.json({ success: true, data: q });
  }

  /* BULK UPLOAD */
  if (action === "bulkUpload") {
    const inserted = await Question.insertMany(data);
    return NextResponse.json({ success: true, count: inserted.length });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}

/* ================= PUT ================= */
export async function PUT(req: Request) {
  await connectDB();
  const { id, data } = await req.json();

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const updated = await Question.findByIdAndUpdate(id, data, { new: true });
  return NextResponse.json({ success: true, data: updated });
}

/* ================= DELETE ================= */
export async function DELETE(req: Request) {
  await connectDB();
  const { id } = await req.json();

  await Question.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
