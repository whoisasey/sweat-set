import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
	interface Session {
		user: {
			name: string;
			userId: string;
			id: string;
			email: string;
		};
	}

	interface User extends DefaultUser {
		name?: string;
		userId?: string;
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
