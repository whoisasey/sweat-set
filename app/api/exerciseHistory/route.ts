import { NextRequest, NextResponse } from "next/server";

import ExerciseSet from "@/app/models/ExerciseSet";
import connect from "@/app/utils/db";
import { formatDate } from "@/app/utils/helpers";
import mongoose from "mongoose";

type ProcessedWorkoutData = {
  exercise: string;
  data: {
    date: string; // formatted
    sets: { setNumber: number; weight: number; reps: number }[];
    avgWeight: string;
    totalReps: string | number;
  }[];
};

// gets all exercise history
export const GET = async (req: NextRequest) => {
  await connect();

  const { searchParams } = new URL(req.url);
  const user = searchParams.get("user");
  const today = searchParams.get("today") === "true";

  try {
    // Handle both UUID strings and MongoDB ObjectId formats
    // Production may have old data with ObjectIds, new data with UUIDs
    let filter: Record<string, unknown>;

    const isValidObjectId = user && mongoose.Types.ObjectId.isValid(user) && user.length === 24;

    if (isValidObjectId) {
      // If it looks like a valid 24-char ObjectId, try both formats
      filter = {
        $or: [{ userId: user }, { userId: new mongoose.Types.ObjectId(user) }],
      };
    } else {
      // Otherwise just use the string (UUID)
      filter = { userId: user };
    }

    if (today) {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      const end = new Date();
      end.setHours(23, 59, 59, 999);
      filter["date"] = { $gte: start, $lte: end };
    }

    const exerciseHistory = await ExerciseSet.find(filter, "exercise date weights reps").lean();
    console.log("[exerciseHistory] Found records:", exerciseHistory.length);
    console.log("[exerciseHistory] First record:", exerciseHistory[0] ? JSON.stringify(exerciseHistory[0]) : "none");
    const grouped: Record<string, typeof exerciseHistory> = {};

    exerciseHistory.forEach((workout) => {
      if (!grouped[workout.exercise]) grouped[workout.exercise] = [];
      grouped[workout.exercise].push(workout);
    });

    const processedData: ProcessedWorkoutData[] = Object.entries(grouped)
      .map(([exercise, workouts]) => ({
        exercise,
        data: workouts
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) // sort entries for each exercise by date ascending
          .map((workout) => {
            const sets = workout.weights.map((weight, idx) => {
              const reps = workout.reps[idx] ?? 0;
              return {
                setNumber: idx + 1,
                weight,
                reps,
              };
            });

            const avgWeight = sets.length ? (sets.reduce((sum, s) => sum + s.weight, 0) / sets.length).toFixed() : "0";

            const totalReps = sets.length ? sets.reduce((sum, s) => sum + s.reps, 0) : "0";

            return {
              date: formatDate(workout.date),
              sets,
              avgWeight,
              totalReps,
            };
          }),
      }))
      // ✅ Sort by total number of entries (descending)
      .sort((a, b) => b.data.length - a.data.length);

    return NextResponse.json(processedData, { status: 200 });
  } catch (err: unknown) {
    console.error("Error fetching exercises:", err);
    const message = err instanceof Error ? err.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
};
