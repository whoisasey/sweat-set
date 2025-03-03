import ExerciseName from "@/app/models/Exercises";
import { NextResponse } from "next/server";
import connect from "@/app/utils/db";

export const POST = async (req: Request) => {
	try {
		await connect();
		console.log("add exercise set...");
		const body = await req.json();

		const newExercise = new ExerciseName({
			name: body.exerciseName,
		});

		const savedExercise = await newExercise.save();
		console.log("New exercise saved 💦");

		return NextResponse.json(savedExercise, { status: 201 });
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
