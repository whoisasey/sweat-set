import mongoose from "mongoose";

const exerciseSchema = new mongoose.Schema(
	{
		exerciseName: { type: String, required: true },
	},
	{ timestamps: true },
);

const db = mongoose.connection.useDb("app");

const ExerciseName = db.model("ExerciseName", exerciseSchema);
export default ExerciseName;
