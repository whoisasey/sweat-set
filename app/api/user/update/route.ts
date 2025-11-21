import { NextRequest, NextResponse } from "next/server";

import User from "@/app/models/User";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth.config";
import connect from "@/app/utils/db";
import { getServerSession } from "next-auth";

export const PUT = async (req: NextRequest) => {
  await connect();

  try {
    // 1) Get the logged-in user from session
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized - Please log in" }, { status: 401 });
    }

    const userId = session.user.id;

    // 2) Parse request body
    const body = await req.json();
    const { firstName, lastName, email, birthdate, weight } = body;

    // 3) Validate that at least one field is being updated
    if (!firstName && !lastName && !email && !birthdate && weight === undefined) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    // 4) Build update object (only include provided fields)
    const updateFields: Record<string, string | number | Date> = {};
    if (firstName !== undefined) updateFields.firstName = firstName;
    if (lastName !== undefined) updateFields.lastName = lastName;
    if (email !== undefined) updateFields.email = email;
    if (birthdate !== undefined) updateFields.birthdate = new Date(birthdate);
    if (weight !== undefined) updateFields.weight = weight;

    // 5) Update user in database
    const updatedUser = await User.findOneAndUpdate({ userId }, updateFields, {
      new: true, // Return the updated document
      runValidators: true, // Run mongoose validators
    }).select("-password");

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (err: unknown) {
    console.error("Error updating user:", err);
    const message = err instanceof Error ? err.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
};
