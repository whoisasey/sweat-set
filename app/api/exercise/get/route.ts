import ExerciseName from "@/app/models/ExerciseName";
import { NextResponse } from "next/server";
import connect from "@/app/utils/db";

export const GET = async () => {
	await connect();

	try {
		const exercises = await ExerciseName.find({});

		return NextResponse.json(exercises, { status: 200 });
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
