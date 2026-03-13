import NextAuth, { type AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {}
      },
      async authorize(credentials) {
        await connectDB();

        const user = await User.findOne({ email: credentials!.email });
        if (!user) throw new Error("User not found");

        const isValid = await bcrypt.compare(
          credentials!.password,
          user.password
        );

        if (!isValid) throw new Error("Wrong password");

        return user; // ✅ MongoDB user
      }
    })
  ],

  session: {
    strategy: "jwt"
  },

  callbacks: {
    /* ================= JWT ================= */
    async jwt({ token, user }) {
      await connectDB();

      // On first login
      if (user) {
        token.id = user._id?.toString(); // ✅ IMPORTANT
        token.role = user.role;
        token.isPremium = user.isPremium;
      }

      // On subsequent requests
      if (!token.id && token.email) {
        const dbUser = await User.findOne({ email: token.email });
        if (dbUser) {
          token.id = dbUser._id.toString();
          token.role = dbUser.role;
          token.isPremium = dbUser.isPremium;
        }
      }

      return token;
    },

    /* ================= SESSION ================= */
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id; // ✅ NOW AVAILABLE
        session.user.role = token.role;
        session.user.isPremium = token.isPremium;
      }
      return session;
    },

    /* ================= GOOGLE SIGN IN ================= */
    async signIn({ user, account }) {
      await connectDB();

      if (account?.provider === "google") {
        const existing = await User.findOne({ email: user.email });

        if (!existing) {
          await User.create({
            name: user.name,
            email: user.email,
            image: user.image,
            provider: "google",
            role: "user",
            isPremium: false
          });
        }
      }

      return true;
    }
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
