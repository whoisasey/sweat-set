import { NextResponse } from "next/server";
import User from "@/app/models/User";
import bcrypt from "bcryptjs";
import connect from "@/app/utils/db";
import { supabaseAdmin } from "@/app/utils/supabase";

export const POST = async (req: Request) => {
  const { email, firstName, password, lastName, birthdate, weight, userId, gender } = await req.json();

  await connect();

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return new NextResponse("User already exists ❌", { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const newUser = new User({
    userId,
    firstName,
    lastName,
    birthdate,
    weight,
    email,
    gender,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    console.log("User registered successfully in MongoDB ✨");

    // Create user in Supabase Auth (for email functionality only)
    // Using a dummy password since we manage auth via NextAuth + MongoDB
    if (supabaseAdmin) {
      const { error: supabaseError } = await supabaseAdmin.auth.admin.createUser({
        email,
        email_confirm: true, // Auto-confirm email
        user_metadata: {
          source: "mongodb", // Track that this user is managed in MongoDB
        },
      });

      if (supabaseError) {
        console.warn("Supabase user creation failed (non-critical):", supabaseError.message);
        // Don't fail the entire registration - Supabase is just for emails
      } else {
        console.log("User created in Supabase for email functionality ✨");
      }
    }

    return NextResponse.json({ message: "User registered successfully ✨" }, { status: 201 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log(error.message);

    return NextResponse.json({ message: "Uh oh, there has been an error ❌", error: error.message }, { status: 500 });
  }
};
