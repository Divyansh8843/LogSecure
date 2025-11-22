import express from "express";
import { register, login, getProfile, updateProfile } from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";
import {
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// ✅ Profile routes
router.get("/profile/:userId", protect, getProfile);
router.put("/profile", protect, updateProfile);

export default router;
