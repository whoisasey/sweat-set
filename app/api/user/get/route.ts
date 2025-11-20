import { NextRequest, NextResponse } from "next/server";

import User from "@/app/models/User";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connect from "@/app/utils/db";
import { getServerSession } from "next-auth";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const GET = async (req: NextRequest) => {
  await connect();

  try {
    // 1) Get the logged-in user from session
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized - Please log in" }, { status: 401 });
    }

    const userId = session.user.id;

    // 2) Retrieve User data from database
    const user = await User.findOne({ userId }).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (err: unknown) {
    console.error("Error fetching user:", err);
    const message = err instanceof Error ? err.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
};
