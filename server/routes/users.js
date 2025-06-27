// server/routes/users.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User, Log } from "../models/user.js";
import { authMiddleware, superAdminOnly } from "../middleware/auth.js";

const router = express.Router();

// GET all sub-admins (not SuperAdmins or Agents)
router.get("/", authMiddleware, superAdminOnly, async (req, res) => {
  const users = await User.find({ role: "SubAdmin" });
  res.json(users);
});

// CREATE sub-admin
router.post("/", authMiddleware, superAdminOnly, async (req, res) => {
  const { email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: "Email already exists" });

  const hash = await bcrypt.hash(password, 10);
  const newUser = new User({ email, password: hash, role: "SubAdmin" });
  await newUser.save();

  await Log.create({ message: `Created Sub-Admin ${email}` });
  res.json({ message: "User created" });
});

// UPDATE email
router.put("/:id", authMiddleware, superAdminOnly, async (req, res) => {
  const { email } = req.body;
  const updated = await User.findByIdAndUpdate(req.params.id, { email });
  await Log.create({ message: `Updated Sub-Admin ${email}` });
  res.json({ message: "User updated" });
});

// DELETE sub-admin
router.delete("/:id", authMiddleware, superAdminOnly, async (req, res) => {
  const deleted = await User.findByIdAndDelete(req.params.id);
  if (deleted) {
    await Log.create({ message: `Deleted Sub-Admin ${deleted.email}` });
  }
  res.json({ message: "User deleted" });
});

// GET activity logs
router.get("/logs", authMiddleware, superAdminOnly, async (req, res) => {
  const logs = await Log.find().sort({ timestamp: -1 }).limit(30);
  res.json(logs);
});

export default router;