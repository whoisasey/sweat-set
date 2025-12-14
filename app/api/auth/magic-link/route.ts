import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/utils/supabase";
import User from "@/app/models/User";
import connect from "@/app/utils/db";

// POST: Send magic link email
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

    return NextResponse.json({ message: "Magic link sent! Check your email to sign in." }, { status: 200 });
  } catch (error) {
    console.error("Error in magic-link route:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// PUT: Verify magic link and return user email
export async function PUT(req: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ message: "Email service not configured" }, { status: 503 });
    }

    const { access_token } = await req.json();

    if (!access_token) {
      return NextResponse.json({ message: "Missing access token" }, { status: 400 });
    }

    // Verify the token with Supabase
    const { data, error } = await supabase.auth.getUser(access_token);

    if (error || !data.user) {
      console.error("Error verifying token:", error);
      return NextResponse.json({ message: "Invalid or expired magic link" }, { status: 401 });
    }

    const email = data.user.email;

    if (!email) {
      return NextResponse.json({ message: "No email found in token" }, { status: 400 });
    }

    // Verify user exists in MongoDB
    await connect();
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Return the user email to sign in with NextAuth
    return NextResponse.json(
      {
        success: true,
        email: user.email,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error verifying magic link:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
