import mongoose from "mongoose";

const exerciseSetSchema = new mongoose.Schema(
  {
    exercise: { type: String, required: true }, // Exercise name (e.g., "squats")
    exerciseId: { type: String, required: true }, // Unique ID for exercise
    weights: { type: [Number], required: true }, // Array of weights per set
    sets: { type: Number, required: true }, // Total sets
    reps: { type: [Number], required: true }, // Total reps per set
    distance: { type: Number, default: 0 }, // Distance for running exercises
    userId: { type: String, required: true }, // User ID
    date: { type: Date, required: true }, // Date of exercise entry
  },
  { timestamps: true }
);

const dbName = process.env.NODE_ENV === "production" ? "app" : "app_dev";

const db = mongoose.connection.useDb(dbName);
// const db = mongoose.connection.useDb("app_dev");

const ExerciseSet = db.model("ExerciseSet", exerciseSetSchema);
export default ExerciseSet;
