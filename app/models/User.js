import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		userId: { type: String },
		firstName: { type: String },
		// lastName: { type: String },
		email: { type: String },
		password: { type: String, required: true },
	},
	{ timestamps: true },
);

const db = mongoose.connection.useDb("app");

const User = db.model("User", userSchema);
export default User;
