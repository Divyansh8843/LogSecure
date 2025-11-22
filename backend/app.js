// ✅ app.js
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env before any other imports
dotenv.config({ path: path.join(__dirname, ".env") });

// Now import the rest
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import { transporter } from "./config/nodemailer.js";
import authRoutes from "./routes/authRoutes.js";
import logRoutes from "./routes/logRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import insightRoutes from "./routes/insightRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";

connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Handle favicon requests gracefully
app.get("/favicon.ico", (req, res) => {
  res.status(204).end();
});

app.get("/", (req, res) => res.send("✅ Secure Log Analyzer Backend Running"));
app.use("/api/auth", authRoutes);
app.use("/api/logs", logRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/insights", insightRoutes);
app.use("/api/contact", contactRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
