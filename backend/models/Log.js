import mongoose from "mongoose";

const logSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    ip: String,
    level: String,
    message: String,
    timestamp: Date,

    batchId: { type: String, index: true },
    originalName: String,
    fileUrl: String,
    cloudinaryPublicId: String,
  },
  { timestamps: true }
);

export default mongoose.model("Log", logSchema);
