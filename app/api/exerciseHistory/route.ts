import { NextRequest, NextResponse } from "next/server";

import ExerciseSet from "@/app/models/ExerciseSet";
import connect from "@/app/utils/db";

type WorkoutLog = {
	userId: string;
	exercise: string;
	weights: number[];
	date: Date;
};

type ProcessedWorkoutData = {
	exercise: string;
	data: { date: Date | string; avgWeight: string }[];
};

// gets all exercise history
export const GET = async (req: NextRequest) => {
	await connect();

	const { searchParams } = new URL(req.url);
	const user = searchParams.get("user");

	try {
		// gets all exercises that matches the UserId
		// filter by userId
		const exerciseHistory: WorkoutLog[] = (await ExerciseSet.find({})).filter(
			(item) => item.userId === user,
		);

		// groups exercises by name

		// Process data
		const grouped: Record<string, { date: Date; avgWeight: string }[]> = {};

		exerciseHistory.forEach((workout) => {
			const avgWeight = (
				workout.weights.reduce((sum, w) => sum + w, 0) / workout.weights.length
			).toFixed();

			if (!grouped[workout.exercise]) grouped[workout.exercise] = [];
			grouped[workout.exercise].push({ date: workout.date, avgWeight });
		});

		// Convert to array format
		const processedData: ProcessedWorkoutData[] = Object.entries(grouped).map(
			([exercise, data]) => ({
				exercise,
				data: data
					.sort(
						(a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
					) // Sort by date (ascending)
					.map((entry) => ({
						...entry,
						date: new Date(entry.date).toLocaleDateString("en-US", {
							year: "numeric",
							month: "2-digit",
							day: "2-digit",
						}),
					})),
			}),
		);

		return NextResponse.json(processedData, { status: 201 });
	} catch (err: unknown) {
		if (err instanceof Error) {
			console.error("Error adding message:", err);
			const statusCode = err.name === "ValidationError" ? 400 : 500;

			return NextResponse.json(
				{
					error: err.message || "An unexpected error occurred",
				},
				{ status: statusCode },
			);
		}

		console.error("unknown error occurred:", err);
		return NextResponse.json(
			{ error: "An unexpected error occurred" },
			{ status: 500 },
		);
	}
};
