import User from "@/app/models/User";
import connect from "@/app/utils/db";
import { getServerSession } from "next-auth";

export async function POST() {
  await connect();

  const session = await getServerSession();

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  await User.findByIdAndUpdate(session.user.id, {
    hasSeenOnboarding: true,
  });

  return Response.json({ success: true });
}
