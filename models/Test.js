import mongoose from "mongoose";

const testSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  testName: String,
  date: String,
  price: Number,
  pdfUrl: String,
});

export default mongoose.model("Test", testSchema);
