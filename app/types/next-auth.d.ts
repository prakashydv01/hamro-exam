import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    
    
    _id: string;
    role?: string;
    isPremium?: boolean;
  }

  interface Session {
    user: {
      id: string;
      role?: string;
      isPremium?: boolean;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
    isPremium?: boolean;
  }
}