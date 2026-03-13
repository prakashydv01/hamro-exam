import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { name, email, password } = await req.json();

    // 1️⃣ Basic validation
    if (!name || !email || !password) {
      return new Response(
        JSON.stringify({ message: "All fields are required" }),
        { status: 400 }
      );
    }

    // 2️⃣ Check existing user
    const exists = await User.findOne({ email });
    if (exists) {
      return new Response(
        JSON.stringify({ message: "User already exists" }),
        { status: 400 }
      );
    }

    // 3️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4️⃣ Create user
    await User.create({
      name,
      email,
      password: hashedPassword,
      provider: "credentials",
      role: "user"
    });

    // 5️⃣ SAFE response
    return new Response(
      JSON.stringify({ message: "User created successfully" }),
      { status: 201 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Server error" }),
      { status: 500 }
    );
  }
}
