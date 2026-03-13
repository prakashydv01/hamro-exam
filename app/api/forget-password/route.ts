import { NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import { transporter } from "@/lib/resend";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    await connectDB();

    const user = await User.findOne({ email });

    // Always return success (security best practice)
    if (!user || user.provider !== "credentials") {
      return NextResponse.json({ success: true });
    }

    const token = crypto.randomBytes(32).toString("hex");

    user.resetToken = token;
    user.resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

    await transporter.sendMail({
      from: `"Hamro Exam" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset your password",
      html: `
        <p>You requested a password reset.</p>
        <p>
          <a href="${resetUrl}" style="color:blue">
            Click here to reset your password
          </a>
        </p>
        <p>This link will expire in 15 minutes.</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("FORGOT ERROR:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
