import User from "../models/User.js";
import Report from "../models/Report.js";
import jwt from "jsonwebtoken";

import crypto from "crypto";
import { sendResetEmail } from "../services/emailservice.js";

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, email, password });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(400).json({ message: "Invalid credentials" });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const token = crypto.randomBytes(20).toString("hex");
  const resetToken = jwt.sign({ id: user._id, token }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
  const link = `${process.env.RESET_URL}/${resetToken}`;
  await sendResetEmail(user.email, user.name, resetToken);
  res.status(200).json({ message: "Password reset link sent to your email" });
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "Invalid token" });

    user.password = password;
    await user.save();
    res.json({ message: "Password reset successfully" });
  } catch (err) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
};

// ✅ Fetch user profile with real-time data
export const getProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ message: "User ID required" });

    // Only allow user to fetch their own profile
    if (String(req.user?.id) !== String(userId)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const user = await User.findById(userId).select("_id name email createdAt lastLogin");
    if (!user) return res.status(404).json({ message: "User not found" });

    // Get real-time total reports count
    const totalReports = await Report.countDocuments({ userId });

    res.json({ 
      user: {
        ...user.toObject(),
        totalReports,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin || user.createdAt
      }
    });
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

// ✅ Update user profile (name/email)
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    // Ensure email uniqueness
    const existing = await User.findOne({ email, _id: { $ne: userId } });
    if (existing) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true, runValidators: true, select: "_id name email" }
    );

    res.json({ message: "Profile updated", user });
  } catch (err) {
    res.status(500).json({ message: "Failed to update profile" });
  }
};
