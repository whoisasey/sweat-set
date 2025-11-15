import { NextResponse } from "next/server";
import User from "@/app/models/User";
import bcrypt from "bcryptjs";
import connect from "@/app/utils/db";

export const POST = async (req: Request) => {
  const { email, firstName, password, lastName, birthdate, weight, userId } = await req.json();

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
    password: hashedPassword,
  });

  try {
    await newUser.save();
    console.log("User registered successfully ✨");

    return NextResponse.json({ message: "User registered successfully ✨" }, { status: 201 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log(error.message);

    return NextResponse.json({ message: "Uh oh, there has been an error ❌", error: error.message }, { status: 500 });
  }
};
