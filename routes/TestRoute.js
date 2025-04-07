import express from "express";
import Test from "../models/Test.js";
import { authMiddleware, adminMiddleware } from "../middleware/AuthMiddleware.js";
import {register} from "../controller/AuthController.js"
const testRouter = express.Router();

// Get tests for a logged-in user
testRouter.get("/getTest", authMiddleware, async (req, res) => {
  const tests = await Test.find({ userId: req.user.userId });
  res.json(tests);
});
testRouter.post("/register",authMiddleware,register)
// Assign a test (Admin Only)
testRouter.post("/assign", authMiddleware, adminMiddleware, async (req, res) => {
  const { userId, testName, date, price, pdfUrl } = req.body;

  try {
    const test = new Test({ userId, testName, date, price, pdfUrl });
    await test.save();
    res.status(201).json({ message: "Test assigned successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to assign test", message: err.message });
  } 
});

export default testRouter;
