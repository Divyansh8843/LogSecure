import express from "express";
import {
  generateReport,
  downloadReport,
  shareReport,
  getReportsByUser,
  getSingleReport,
  deleteReport,
} from "../controllers/reportController.js";

const router = express.Router();

router.post("/generate", generateReport);
router.get("/download/:id", downloadReport);
router.post("/share", shareReport);
router.get("/user/:userId", getReportsByUser);
router.get("/:id", getSingleReport);
router.delete("/:id", deleteReport);

export default router;
