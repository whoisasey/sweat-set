import { NextRequest, NextResponse } from "next/server";

import User from "@/app/models/User";
import connect from "@/app/utils/db";
import { supabase } from "@/app/utils/supabase";

export async function POST(req: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ message: "Email service not configured" }, { status: 503 });
    }

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    // Connect to MongoDB to verify user exists
    await connect();
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "No account found with that email address" }, { status: 404 });
    }

    // Use Supabase to send magic link email
    const { error } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/callback`,
      },
    });

    if (error) {
      console.error("Error sending magic link email:", error);
      return NextResponse.json({ message: "Failed to send magic link email" }, { status: 500 });
    }

    console.log("magic link route...");

    return NextResponse.json({ message: "Magic link sent! Check your email to sign in." }, { status: 200 });
  } catch (error) {
    console.error("Error in magic-link route:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
