import { NextRequest, NextResponse } from "next/server";

import ExerciseSet from "@/app/models/ExerciseSet";
import connect from "@/app/utils/db";

// gets all exercise history
export const GET = async (req: NextRequest) => {
	await connect();

	const { searchParams } = new URL(req.url);
	const user = searchParams.get("user");

	try {
		// gets all exercises that matches the UserId
		// filter by userId
		const exerciseHistory = (await ExerciseSet.find({})).filter(
			(item) => item.userId === user,
		);

		// groups exercises by name (front end?)
		// later: filters exercises based on exerciseName user selects

		return NextResponse.json(exerciseHistory, { status: 201 });
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
