import { NextRequest, NextResponse } from "next/server";

import User from "@/app/models/User";
import bcrypt from "bcryptjs";
import connect from "@/app/utils/db";
import { supabase } from "@/app/utils/supabase";

// TODO: token expires quickly
export async function POST(req: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ message: "Email service not configured" }, { status: 503 });
    }

    const { accessToken, password } = await req.json();

    if (!accessToken || !password) {
      return NextResponse.json({ message: "Access token and password are required" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ message: "Password must be at least 6 characters" }, { status: 400 });
    }

    // Get the user from the session using the access token
    const {
      data: { user: supabaseUser },
      error,
    } = await supabase.auth.getUser(accessToken);

    if (error || !supabaseUser) {
      console.error("Error verifying token:", error);
      return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 });
    }

    // Connect to MongoDB and update the user's password
    await connect();
    const hashedPassword = await bcrypt.hash(password, 10);

    // Normalize email to lowercase for case-insensitive lookup
    const email = supabaseUser.email?.toLowerCase().trim();

    const user = await User.findOneAndUpdate({ email }, { password: hashedPassword }, { new: true });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Password reset successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error in reset-password route:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
