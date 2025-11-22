import dotenv from "dotenv";
import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendTest() {
  try {
    const info = await transporter.sendMail({
      from: `"Secure Log Analyzer" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // send to your own Gmail
      subject: "✅ Secure Log Analyzer - Test Email",
      html: `
        <h2>Hello Hemish 👋</h2>
        <p>Your Gmail email service is now working perfectly!</p>
        <p><b>Environment variables are loading correctly.</b></p>
      `,
    });
    console.log("✅ Email sent:", info.messageId);
  } catch (error) {
    console.error("❌ Email test failed:", error);
  }
}

sendTest();
