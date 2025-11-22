import { NextResponse } from "next/server";
import User from "@/app/models/User";
import connect from "@/app/utils/db";
import { getServerSession } from "next-auth";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(req: Request) {
  await connect();
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // console.log("SESSION...", session);

  await User.findByIdAndUpdate(session.user.id, {
    hasSeenOnboarding: true,
  });

  // console.log("USER...", session.user);

  return NextResponse.json({ success: true });
}
