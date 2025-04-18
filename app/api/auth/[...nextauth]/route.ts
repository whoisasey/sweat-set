/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth, { Account, User as AuthUser } from "next-auth";

import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/app/models/User";
import bcrypt from "bcryptjs";
import connect from "@/app/utils/db";

async function handler(req: any, res: any) {
	const providers = [
		CredentialsProvider({
			id: "credentials",
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "text" },
				password: { label: "Password", type: "password" },
			},
			async authorize(
				credentials: Record<"email" | "password", string> | undefined,
			) {
				await connect();
				console.log("authorizing...");

				try {
					if (!credentials) throw new Error("No credentials provided");

					const { email, password } = credentials;

					const user = await User.findOne({ email });

					if (user) {
						const isPasswordCorrect = await bcrypt.compare(
							password,
							user.password,
						);

						if (isPasswordCorrect) {
							console.log("logging user in... ✨");

							return user as AuthUser;
						}
					}
				} catch (err: unknown) {
					if (err instanceof Error) throw new Error(err.message);
				}
				return null;
			},
		}),
	];

	return await NextAuth(req, res, {
		providers,
		secret: process.env.NEXTAUTH_SECRET,
		session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },

		pages: {
			signIn: "/login",
		},
		callbacks: {
			async signIn({
				account,
			}: {
				user: AuthUser;
				account: Account | null;
			}): Promise<boolean> {
				if (account?.provider === "credentials") {
					return true;
				}

				// Optionally handle other providers or additional logic
				return false; // Default return if provider is not "credentials"
			},
			async jwt({
				token,
				user,
				session,
			}: {
				token: any;
				user?: AuthUser;
				session?: any;
			}) {
				// Pass user information to token if user exists
				if (user) {
					return {
						...token,
						name: `${user.firstName}}`,
						id: user.userId,
						session,
					};
				}

				// If no user, return the token as is
				return token;
			},
			async session({ session, token, user }) {
				return {
					...session,
					user: { ...session.user, id: token.id, name: token.name },
				};
			},
		},
	});
}

export { handler as GET, handler as POST };
