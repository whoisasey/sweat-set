import ExerciseSet from "@/app/models/ExerciseSet";
import { NextResponse } from "next/server";
import connect from "@/app/utils/db";

export const POST = async (req: Request) => {
	try {
		await connect();
		const body = await req.json();

		// Validate and transform weights
		const weights = Object.keys(body)
			.filter((key) => key.startsWith("weight-")) // Filter keys that start with "weight-"
			.map((key) => Number(body[key])) // Convert each value to a number
			.filter((num) => !isNaN(num)); // Filter out any NaN values

		const reps = Object.keys(body)
			.filter((key) => key.startsWith("rep-")) // Filter keys that start with "weight-"
			.map((key) => Number(body[key])) // Convert each value to a number
			.filter((num) => !isNaN(num)); // Filter out any NaN values

		// Constrcut exercise object
		const newExercise = new ExerciseSet({
			exercise: body.exercise,
			exerciseId: body.exerciseId,
			weights,
			sets: Number(body.sets) || 0,
			reps,
			distance: Number(body.distance) || 0,
			userId: body.userId,
			date: new Date(body.date),
		});

		// Save to DB
		const savedExercise = await newExercise.save();
		console.log("Exercise saved 💦");

		return NextResponse.json(savedExercise, { status: 201 });
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.error("Error adding message:", error);
			const statusCode = error.name === "ValidationError" ? 400 : 500;
			return NextResponse.json(
				{ error: error.message || "An unexpected error occurred" },
				{ status: statusCode },
			);
		}

		// If the error is not an instance of Error, handle accordingly
		console.error("Unknown error occurred:", error);
		return NextResponse.json(
			{ error: "An unexpected error occurred" },
			{ status: 500 },
		);
	}
};
