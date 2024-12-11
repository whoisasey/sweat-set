import mongoose from "mongoose";

const exerciseSchema = new mongoose.Schema(
	{
		// userId: { type: String },
		singleExercises: [
			{ type: mongoose.Schema.Types.ObjectId, ref: "SingleExercise" },
		], // Array of references to SingleExercise
	},
	{ timestamps: true },
);

const db = mongoose.connection.useDb("app");

const User = db.model("Exercise", exerciseSchema);
export default User;
