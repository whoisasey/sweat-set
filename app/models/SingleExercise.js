import mongoose from "mongoose";

const singleExerciseSchema = new mongoose.Schema(
	{
		name: { type: String },
		weight: { type: Number },
		date: { type: Date },
		userId: { type: String },
	},
	{ timestamps: true },
);

const db = mongoose.connection.useDb("app");

const User = db.model("SingleExercise", singleExerciseSchema);
export default User;
