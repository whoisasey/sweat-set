import { NextRequest, NextResponse } from "next/server";

import ExerciseName from "@/app/models/ExerciseName";
import connect from "@/app/utils/db";

// Checks if exercise being added already exists
export const GET = async (req: NextRequest) => {
	await connect();
	const { searchParams } = new URL(req.url);
	const name = searchParams.get("name");

	try {
		const exercises = await ExerciseName.find({});
		// Filter exercises by name if 'name' is provided
		const exerciseExists = exercises.some(
			(exercise) =>
				exercise.exerciseName.toLowerCase() === (name as string).toLowerCase(),
		);

		return NextResponse.json({ exists: exerciseExists }, { status: 200 });
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
