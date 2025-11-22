import express from "express";
import {
  uploadAndAnalyze,
  memoryUpload,
} from "../controllers/logController.js";
import { protect } from "../middlewares/authMiddleware.js"; // optional if you're using JWT auth

const router = express.Router();

router.post("/upload", protect, memoryUpload, uploadAndAnalyze);

export default router;
