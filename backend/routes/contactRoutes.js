import express from "express";
import { handleContactForm } from "../controllers/contactController.js";

const router = express.Router();

router.post("/submit", handleContactForm);

export default router;