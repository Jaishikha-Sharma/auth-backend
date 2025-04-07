import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// Register route (Supports Admin & User Registration)
router.post("/register", async (req, res) => {
  const { name, email, password, role, phone } = req.body;
  
 console.log("i got hit", req.body)

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already registered. Please login or use another email." });
    }

    // Determine role: Only allow 'admin' if secret key is correct
    let assignedRole = "user";
 

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, role: assignedRole,phone });

    // Generate JWT token including user role
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(201).json({
      token,
      name: user.name,
      role: user.role,
      message: "Registration successful. Welcome!",
    });
  } catch (err) {
    res.status(500).json({ error: "Registration failed. Please try again later.", message: err.message });
  }
});

// Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // Compare provided password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // Generate JWT token including user role
    const token = jwt.sign({ userId: user._id, role: user.isAdmin ? "Admin" : "User" }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({
      token,
      name: user.name,
      role: user.isAdmin ? "Admin" : "User",
      message: "Login successful. Welcome back!",
    });
  } catch (err) {
    res.status(500).json({ error: "Login failed. Please try again later.", message: err.message });
  }
});

export default router;
