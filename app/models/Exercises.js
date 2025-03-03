import mongoose from "mongoose";

const exerciseSchema = new mongoose.Schema(
	{
		exerciseName: String,
	},
	{ timestamps: true },
);

const db = mongoose.connection.useDb("app");

const User = db.model("ExerciseName", exerciseSchema);
export default User;
