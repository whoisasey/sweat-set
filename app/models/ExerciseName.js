import mongoose from "mongoose";

const exerciseSchema = new mongoose.Schema(
	{
		exerciseName: { type: String, required: true },
	},
	{ timestamps: true },
);

const dbName = process.env.NODE_ENV === "production" ? "app" : "app_dev";

const db = mongoose.connection.useDb(dbName);

const ExerciseName = db.model("ExerciseName", exerciseSchema);
export default ExerciseName;
