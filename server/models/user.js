import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  role: String,
});

const logSchema = new mongoose.Schema({
  message: String,
  timestamp: { type: Date, default: Date.now },
});

export const User = mongoose.model("User", userSchema);
export const Log = mongoose.model("Log", logSchema);