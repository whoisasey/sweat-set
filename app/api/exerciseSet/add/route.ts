import ExerciseSet from "@/app/models/ExerciseSet";
import { NextResponse } from "next/server";
import connect from "@/app/utils/db";

export const POST = async (req: Request) => {
  try {
    await connect();
    const body = await req.json();

    const reps = Array.isArray(body.reps) ? body.reps.map(Number) : [];
    const weights = Array.isArray(body.weights) ? body.weights.map(Number) : [];

    const newExercise = new ExerciseSet({
      exercise: body.exercise,
      exerciseId: body.exerciseId,
      weights,
      reps,
      sets: Math.max(weights.length, reps.length),
      distance: Number(body.distance) || 0,
      userId: body.userId,
      date: new Date(body.date),
    });

    const savedExercise = await newExercise.save();
    console.log("Exercise saved 💦");

    return NextResponse.json(savedExercise, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error adding exercise:", error);
      const statusCode = error.name === "ValidationError" ? 400 : 500;
      return NextResponse.json({ error: error.message || "Unexpected error" }, { status: statusCode });
    }

    console.error("Unknown error occurred:", error);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
};
