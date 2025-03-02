import { NextResponse } from "next/server";
// import SingleExercise from "@/app/models/SingleExercise";
import connect from "@/app/utils/db";

// POST handler for adding a message
export const POST = async (req: Request) => {
	try {
		// Connect to the database
		await connect();
		console.log("...ADD SINGLE EXERCISE");

		// Parse the request body
		const body = await req.json();
		console.log(body);

		// Destructure the required fields
		// const { from, to, message, toUserName } = body;

		// // Validate required fields
		// if (!from || !to || !message) {
		// 	return NextResponse.json(
		// 		{ error: "Missing required fields: from, to, or message" },
		// 		{ status: 400 },
		// 	);
		// }

		// });

		// // Save the message to the database
		// const data = await SingleExercise.create({
		// 	message: { text: message },
		// 	from,
		// 	to,
		// 	toUserName,
		// });

		const data = {};
		// Respond with success if the message is saved
		return NextResponse.json({ data }, { status: 200 });
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		console.error("Error adding message:", error);
		const statusCode = error.name === "ValidationError" ? 400 : 500;
		return NextResponse.json(
			{ error: error.message || "An unexpected error occurred" },
			{ status: statusCode },
		);
	}
};
