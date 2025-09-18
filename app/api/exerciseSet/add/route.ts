import ExerciseSet from "@/app/models/ExerciseSet";
import { NextResponse } from "next/server";
import connect from "@/app/utils/db";

export const POST = async (req: Request) => {
  try {
    await connect();
    const body = await req.json();

    const transformToArray = (state: string) => {
      return Object.keys(body)
        .filter((key) => key.startsWith(`${state}-`))
        .map((key) => Number(body[key]))
        .filter((num) => !isNaN(num));
    };

    const weights = transformToArray("weight");
    const reps = transformToArray("rep");

    const newExercise = new ExerciseSet({
      exercise: body.exercise,
      exerciseId: body.exerciseId,
      weights,
      reps,
      sets: Math.max(weights.length, reps.length), // optional: sets = max of reps/weights length
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
