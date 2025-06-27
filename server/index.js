import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Lead } from "./models/lead.js";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  role: String
});

const User = mongoose.model("User", userSchema);

app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      "mySecretKey",
      { expiresIn: "1d" }
    );

    res.json({ token, role: user.role });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/", (req, res) => {
  res.send("API is running");
});

// ************* fetch users details ***************

app.get("/users", async (req, res) => {
  try {
    const users = await User.find({ role: "SubAdmin" });
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

app.get("/users/logs", async (req, res) => {
  try {
    const logs = await Log.find().sort({ timestamp: -1 }).limit(20);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: "Error fetching logs" });
  }
});

// ************* create users details ***************

app.post("/users-create", async (req, res) => {
  const { email, password } = req.body;
  try {
      const user = new User({ email, password, role: "SubAdmin" });
      await user.save();
    res.json({ message: "User created", user });
  } catch (err) {
    res.status(500).json({ error: "Error creating user" });
  }
});

app.put("/users-update/:id", async (req, res) => {
  const { id } = req.params;
  const { email } = req.body;
  try {
    await User.findByIdAndUpdate(id, { email });
    res.json({ message: "User updated" });
  } catch (err) {
    res.status(500).json({ error: "Error updating user" });
  }
});

// ************* fetch leads *****************
// Get all leads
app.get("/leads", async (req, res) => {
  try {
    const leads = await Lead.find();
    res.json(leads);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch leads" });
  }
});

// Create lead
app.post("/leads-create", async (req, res) => {
  try {
    const lead = new Lead({
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await lead.save();
    res.status(201).json({ message: "Lead created" });
  } catch (err) {
    res.status(500).json({ message: "Failed to create lead" });
  }
});

// Update lead
app.put("/leads-update/:id", async (req, res) => {
  try {
    await Lead.findByIdAndUpdate(req.params.id, {
      ...req.body,
      updatedAt: new Date(),
    });
    res.json({ message: "Lead updated" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update lead" });
  }
});

// Delete lead
app.delete("/leads-delete/:id", async (req, res) => {
  try {
    await Lead.findByIdAndDelete(req.params.id);
    res.json({ message: "Lead deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete lead" });
  }
});




app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});