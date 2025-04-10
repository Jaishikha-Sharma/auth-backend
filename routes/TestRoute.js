import express from "express";
import Test from "../models/Test.js";
import { authMiddleware, adminMiddleware } from "../middleware/AuthMiddleware.js";
import {register} from "../controller/AuthController.js"
const testRouter = express.Router();
import multer from "multer";
import cloudinary from "../utils/cloudinary.js";
import fs from "fs";

const upload = multer({ dest: "uploads/" });

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
testRouter.post("/upload", authMiddleware, adminMiddleware, upload.single("file"), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "raw", // because it's a PDF
    });

    // Delete local file after upload
    fs.unlinkSync(req.file.path);

    res.status(200).json({ url: result.secure_url });
  } catch (err) {
    res.status(500).json({ message: "Failed to upload PDF", error: err.message });
  }
});

export default testRouter;
