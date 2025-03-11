import { NextRequest, NextResponse } from "next/server";

import ExerciseSet from "@/app/models/ExerciseSet";
import connect from "@/app/utils/db";
import { formatDate } from "@/app/utils/helpers";

type WorkoutLog = {
	userId: string;
	exercise: string;
	weights: number[];
	date: Date;
	reps: number[];
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

		// Process data
		const grouped: Record<
			string,
			{
				date: Date;
				sets: { setNumber: number; weight: number; reps: number }[];
				avgWeight: string;
			}[]
		> = {};

		exerciseHistory.forEach(({ exercise, weights, date, reps }) => {
			const avgWeight = (
				weights.reduce((sum, w) => sum + w, 0) / weights.length
			).toFixed();

			if (!grouped[exercise]) grouped[exercise] = [];
			grouped[exercise].push({
				date: date,
				sets: [
					{ setNumber: 1, weight: weights[0], reps: reps[0] },
					{ setNumber: 2, weight: weights[1], reps: reps[1] },
					{ setNumber: 3, weight: weights[2], reps: reps[2] },
				],
				avgWeight,
			});
		});

		// Convert to array format
		const processedData: ProcessedWorkoutData[] = Object.entries(grouped)
			.map(([exercise, data]) => ({
				exercise,
				data: data
					.sort(
						(a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
					) // Sort by date (ascending)
					.map((entry) => ({
						...entry,
						date: formatDate(entry.date),
					})),
			}))
			.sort((a, b) => b.data.length - a.data.length); // sort by length of entries

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
