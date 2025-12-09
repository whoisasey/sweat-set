import { NextRequest, NextResponse } from "next/server";

import User from "@/app/models/User";
import connect from "@/app/utils/db";
import { supabase } from "@/app/utils/supabase";

export async function POST(req: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ message: "Email service not configured" }, { status: 503 });
    }

    const { email: rawEmail } = await req.json();

    if (!rawEmail) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    // Normalize email to lowercase for case-insensitive lookup
    const email = rawEmail.toLowerCase().trim();

    // Connect to MongoDB to verify user exists
    await connect();
    const user = await User.findOne({ email }); // comes from Mngo DB

    if (!user) {
      // For security, don't reveal if user exists or not
      // TODO: magic link not sending email
      // TODO: add User changelog instead of md docs
      return NextResponse.json(
        { message: "If an account with that email exists, a password reset link has been sent." },
        { status: 200 }
      );
    }

    // Use Supabase to send password reset email
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password`,
    });

    if (error) {
      console.error("Error sending password reset email:", error);
      return NextResponse.json({ message: "Failed to send password reset email" }, { status: 500 });
    }

    console.log("forgot password route...");

    return NextResponse.json(
      { message: "If an account with that email exists, a password reset link has been sent." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in forgot-password route:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
