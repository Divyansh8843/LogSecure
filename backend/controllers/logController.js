import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import Log from "../models/Log.js";
import { analyzeLogs } from "../services/logService.js";
import streamifier from "streamifier";

// ✅ Use in-memory upload (no local files)
const upload = multer({ storage: multer.memoryStorage() });
export const memoryUpload = upload.single("logFile");

export const uploadAndAnalyze = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    console.log(
      `📁 File received: ${req.file.originalname} (${req.file.size} bytes)`
    );

    const logContent = req.file.buffer.toString("utf8");
    if (!logContent.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Empty log file" });
    }

    // ✅ Upload to Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "raw",
        folder: "log-analyzer/logs",
        public_id: `log_${Date.now()}_${req.file.originalname.replace(
          /\.[^/.]+$/,
          ""
        )}`,
      },
      async (error, result) => {
        if (error) {
          console.error("❌ Cloudinary upload failed:", error);
          return res
            .status(500)
            .json({ success: false, message: "Cloudinary upload failed." });
        }

        console.log("☁️ Cloudinary upload success:", result.secure_url);

        try {
          // ✅ Analyze logs
          const analysis = analyzeLogs(logContent, req.user?.id || "anonymous");

          // ✅ Save log info to MongoDB
          const logEntry = await Log.create({
            userId: req.user?.id || null,
            originalName: req.file.originalname,
            fileUrl: result.secure_url,
            cloudinaryPublicId: result.public_id,
            batchId: analysis.batchId,
            level: "INFO",
            message: `File analyzed: ${req.file.originalname}`,
            timestamp: new Date(),
          });

          console.log("✅ Log entry created in DB:", logEntry._id);

          // ✅ Return complete and frontend-compatible response
          return res.status(200).json({
            success: true,
            message: "Log analyzed successfully.",
            logId: logEntry._id,
            fileUrl: result.secure_url,
            filename: req.file.originalname,
            totalLogs: analysis.totalLogs,
            ipFrequency: analysis.ipFrequency,
            levelCounts: analysis.levelCounts,
            eventsOverTime: analysis.eventsOverTime,
            suspicious: analysis.suspicious,
            topIps: analysis.topIps,
          });
        } catch (err) {
          console.error("❌ Log analysis failed:", err);
          return res
            .status(500)
            .json({ success: false, message: "Error during log analysis." });
        }
      }
    );

    // ✅ Stream file buffer to Cloudinary
    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
  } catch (err) {
    console.error("❌ Upload error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error during upload.",
    });
  }
};
