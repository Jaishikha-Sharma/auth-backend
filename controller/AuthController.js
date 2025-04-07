import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config(); // Ensure .env is loaded

export const register = async (req, res) => {
  const { name, email, password, phone } = req.body;
  const {role,userId} = req.user;
  if (!role || role !== "Admin"){
    return res.status(409).json({message:"Unauthorized"})
  }
  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ _id:new mongoose.Types.ObjectId(userId) });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Check if the user should be an admin (based on email)
    const adminEmails = process.env.ADMIN_EMAILS?.split(",") || []; // Define ADMIN_EMAILS in .env as a comma-separated list
    

    // Create new user with role
    const user = new User({ name, email, password: hashedPassword, phone, isAdmin });   
    return res.status(200).json({existingUser})
  const response = await user.save();
    // Generate JWT token with role info
    const token = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      isAdmin: user.isAdmin,
    });

  } catch (err) {
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
};
