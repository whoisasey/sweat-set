import { NextRequest, NextResponse } from "next/server";

import ExerciseSet from "@/app/models/ExerciseSet";
import connect from "@/app/utils/db";
import { formatDate } from "@/app/utils/helpers";

type ProcessedWorkoutData = {
  exercise: string;
  data: {
    date: string; // formatted
    sets: { setNumber: number; weight: number; reps: number }[];
    avgWeight: string;
  }[];
};

// gets all exercise history
export const GET = async (req: NextRequest) => {
  await connect();

  const { searchParams } = new URL(req.url);
  const user = searchParams.get("user");

  try {
    const exerciseHistory = (await ExerciseSet.find({ userId: user })) || [];

    const grouped: Record<string, typeof exerciseHistory> = {};

    exerciseHistory.forEach((workout) => {
      if (!grouped[workout.exercise]) grouped[workout.exercise] = [];
      grouped[workout.exercise].push(workout);
    });

    const processedData: ProcessedWorkoutData[] = Object.entries(grouped).map(([exercise, workouts]) => ({
      exercise,
      data: workouts
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .map((workout) => {
          const avgWeight = workout.weights.length
            ? (workout.weights.reduce((sum, w) => sum + w, 0) / workout.weights.length).toFixed()
            : "0";

          const sets = workout.weights.map((weight, idx) => ({
            setNumber: idx + 1,
            weight,
            reps: workout.reps[idx] ?? 0, // match reps to weight if available
          }));

          return {
            date: formatDate(workout.date), // keep your existing formatDate
            sets,
            avgWeight,
          };
        }),
    }));

    return NextResponse.json(processedData, { status: 200 });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Error fetching exercises:", err);
      const statusCode = err.name === "ValidationError" ? 400 : 500;
      return NextResponse.json({ error: err.message || "Unexpected error" }, { status: statusCode });
    }
    console.error("Unknown error:", err);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
};
