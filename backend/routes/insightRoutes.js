import express from "express";
import { generateInsights } from "../controllers/insightController.js";

const router = express.Router();

// @route POST /api/insights/generate
router.post("/generate", generateInsights);

export default router;
