import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { type: "email" },
        password: { type: "password" }
      },
      async authorize(credentials) {
        await connectDB();

        const user = await User.findOne({ email: credentials!.email });
        if (!user) throw new Error("User not found");

        const valid = await bcrypt.compare(
          credentials!.password,
          user.password
        );

        if (!valid) throw new Error("Invalid password");

        return user;
      }
    })
  ],

  callbacks: {
    async signIn({ user, account }) {
      await connectDB();

      const existing = await User.findOne({ email: user.email });

      if (!existing) {
        await User.create({
          name: user.name,
          email: user.email,
          image: user.image,
          provider: account?.provider,
          role: "user",
          isPremium: false
        });
      }

      return true;
    },

    async session({ session }) {
      await connectDB();
      const dbUser = await User.findOne({ email: session.user.email });

      session.user.id = dbUser._id.toString();
      session.user.role = dbUser.role;
      session.user.isPremium = dbUser.isPremium;

      return session;
    }
  },

  secret: process.env.NEXTAUTH_SECRET
};
