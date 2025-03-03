import { DefaultSession } from "next-auth";

declare module "next-auth" {
	interface Session {
		user: {
			name: string;
			userId: string;
			firstName?: string;
			// lastName?: string;
			id: string;
			email: string;
		} & DefaultSession["user"];
	}

	interface User extends DefaultUser {
		name?: string;
		userId?: string;
		firstName?: string;
		// lastName?: string;
		email?: string;
		id?: string;
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		id: string;
		role: number;
	}
}
