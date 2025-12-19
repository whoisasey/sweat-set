import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userId: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String },
    password: { type: String, required: true },
    birthdate: { type: Date },
    weight: { type: Number },
    gender: { type: String },
  },
  { timestamps: true }
);

// const dbName = process.env.NODE_ENV === "production" ? "app" : "app_dev";

// const db = mongoose.connection.useDb(dbName);
const db = mongoose.connection.useDb("app");

const User = db.model("User", userSchema);
export default User;
