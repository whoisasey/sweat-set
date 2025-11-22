import { Account, AuthOptions, User as AuthUser } from "next-auth";

import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/app/models/User";
import bcrypt from "bcryptjs";
import connect from "@/app/utils/db";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: Record<"email" | "password", string> | undefined) {
        await connect();
        if (!credentials) throw new Error("No credentials provided");

        const { email, password } = credentials;
        const user = await User.findOne({ email });

        if (user) {
          const isPasswordCorrect = await bcrypt.compare(password, user.password);
          if (isPasswordCorrect) {
            return user as AuthUser;
          }
        }
        return null;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },

  pages: {
    signIn: "/login",
  },

  callbacks: {
    async jwt({ token, user }) {
      // Only add id and name when the user first logs in
      if (user) {
        token.id = user.userId || "";
        token.name = user.firstName || user.name || "";
      }

      return token;
    },

    async session({ session, token }) {
      // session.user will now always have id and name immediately
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          name: token.name as string,
        },
      };
    },

    async signIn({ account }: { user: AuthUser; account: Account | null }): Promise<boolean> {
      if (account?.provider === "credentials") return true;
      return false;
    },
  },
};
