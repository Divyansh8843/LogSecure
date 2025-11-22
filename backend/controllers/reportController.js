import Report from "../models/Report.js";
import { sendReportEmail } from "../services/emailservice.js";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

export const generateReport = async (req, res) => {
  try {
    if (!req.body.userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const {
      userId,
      summary,
      ipFrequency,
      levelCounts,
      suspiciousIPs,
      totalLogs,
      errorLogs,
      filename,
      fileUrl,
      charts,
      eventsOverTime,
    } = req.body;

    const report = await Report.create({
      userId,
      title: filename || `Log Report - ${new Date().toLocaleString()}`,
      summary:
        summary ||
        `Log analysis report generated on ${new Date().toLocaleString()}`,
      charts: charts || {
        ipFrequency: ipFrequency || {},
        levelCounts: levelCounts || {},
        eventsOverTime: eventsOverTime || {},
      },
      suspiciousIPs: suspiciousIPs || 0,
      totalLogs: totalLogs || 0,
      errorLogs: errorLogs || 0,
      fileUrl: fileUrl || "",
      filename: filename || `log-report-${Date.now()}`,
      ipFrequency: ipFrequency || {},
      levelCounts: levelCounts || {},
      eventsOverTime: eventsOverTime || {},
      topIps: Object.entries(ipFrequency || {})
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([ip, count]) => [ip, count]),
    });

    res.status(201).json({ message: "Report generated", report });
  } catch (error) {
    console.error("Report generation error:", error);
    res.status(500).json({ message: "Report generation failed" });
  }
};

export const shareReport = async (req, res) => {
  try {
    const { email, userName, reportUrl, reportId } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    // Fetch report data if reportId is provided
    let reportData = {};
    if (reportId) {
      const report = await Report.findById(reportId).select("-__v");
      if (report) {
        reportData = {
          filename: report.filename || report.title,
          title: report.title,
          totalLogs: report.totalLogs || 0,
          suspiciousIPs: report.suspiciousIPs || 0,
          errorLogs: report.errorLogs || 0,
        };
      }
    }

    // Use provided reportUrl or generate one
    const finalReportUrl =
      reportUrl ||
      (reportId
        ? `${
            process.env.FRONTEND_URL || "http://localhost:5173"
          }/dashboard?reportId=${reportId}`
        : "");

    if (!finalReportUrl) {
      return res.status(400).json({ message: "Report URL is required." });
    }

    await sendReportEmail(
      email,
      userName || "User",
      finalReportUrl,
      reportData
    );

    res
      .status(200)
      .json({ message: "✅ Report shared successfully via email!" });
  } catch (error) {
    console.error("❌ Error sharing report:", error.message);
    res
      .status(500)
      .json({ message: "Error sharing report.", error: error.message });
  }
};

export const downloadReport = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Report ID is required" });
    }

    // Fetch report from database
    const report = await Report.findById(id);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    // Create a new PDF in memory
    const doc = new PDFDocument({
      margin: 50,
      size: "A4",
    });

    const buffers = [];
    doc.on("data", buffers.push.bind(buffers));

    doc.on("end", () => {
      const pdfBuffer = Buffer.concat(buffers);

      // Set proper headers for PDF download
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="report-${id}.pdf"`
      );
      res.setHeader("Content-Length", pdfBuffer.length);

      res.send(pdfBuffer);
    });

    // ✅ Create attractive PDF content
    // Header
    doc
      .fillColor("#2563eb")
      .fontSize(24)
      .font("Helvetica-Bold")
      .text("Log Analyzer Report", { align: "center" });

    doc.moveDown(0.5);
    doc
      .fillColor("#6b7280")
      .fontSize(12)
      .font("Helvetica")
      .text(`Generated: ${new Date(report.createdAt).toLocaleString()}`, {
        align: "center",
      });

    doc.moveDown(1);
    doc
      .strokeColor("#e5e7eb")
      .lineWidth(1)
      .moveTo(50, doc.y)
      .lineTo(550, doc.y)
      .stroke();
    doc.moveDown(1);

    // Report Title
    if (report.filename || report.title) {
      doc
        .fillColor("#1f2937")
        .fontSize(16)
        .font("Helvetica-Bold")
        .text("Report Details", { underline: true });
      doc.moveDown(0.5);
      doc
        .fillColor("#374151")
        .fontSize(12)
        .font("Helvetica")
        .text(`File: ${report.filename || report.title}`);
      doc.moveDown(1);
    }

    // Summary Section
    doc
      .fillColor("#1f2937")
      .fontSize(16)
      .font("Helvetica-Bold")
      .text("Summary", { underline: true });
    doc.moveDown(0.5);

    doc
      .fillColor("#374151")
      .fontSize(12)
      .font("Helvetica")
      .text(`Total Logs Analyzed: ${report.totalLogs || 0}`, { indent: 20 });
    doc.text(`Error Logs: ${report.errorLogs || 0}`, { indent: 20 });
    doc.text(`Suspicious IPs Detected: ${report.suspiciousIPs || 0}`, {
      indent: 20,
    });

    doc.moveDown(1);

    // Level Counts Section
    if (report.levelCounts && Object.keys(report.levelCounts).length > 0) {
      doc
        .fillColor("#1f2937")
        .fontSize(16)
        .font("Helvetica-Bold")
        .text("Log Level Distribution", { underline: true });
      doc.moveDown(0.5);

      Object.entries(report.levelCounts).forEach(([level, count]) => {
        doc
          .fillColor("#374151")
          .fontSize(12)
          .font("Helvetica")
          .text(`• ${level}: ${count}`, { indent: 20 });
      });
      doc.moveDown(1);
    }

    // Top IPs Section
    if (report.topIps && report.topIps.length > 0) {
      doc
        .fillColor("#1f2937")
        .fontSize(16)
        .font("Helvetica-Bold")
        .text("Top IP Addresses", { underline: true });
      doc.moveDown(0.5);

      report.topIps.forEach(([ip, count], index) => {
        doc
          .fillColor("#374151")
          .fontSize(12)
          .font("Helvetica")
          .text(`${index + 1}. ${ip}: ${count} occurrences`, { indent: 20 });
      });
      doc.moveDown(1);
    }

    // Summary Text
    if (report.summary) {
      doc
        .fillColor("#1f2937")
        .fontSize(16)
        .font("Helvetica-Bold")
        .text("Analysis Summary", { underline: true });
      doc.moveDown(0.5);
      doc
        .fillColor("#374151")
        .fontSize(11)
        .font("Helvetica")
        .text(report.summary, {
          indent: 20,
          align: "left",
          width: 500,
        });
    }

    // Footer
    doc.moveDown(2);
    doc
      .strokeColor("#e5e7eb")
      .lineWidth(1)
      .moveTo(50, doc.y)
      .lineTo(550, doc.y)
      .stroke();
    doc.moveDown(0.5);
    doc
      .fillColor("#9ca3af")
      .fontSize(10)
      .font("Helvetica")
      .text("Generated by Secure Log Analyzer", { align: "center" });

    doc.end();
  } catch (error) {
    console.error("❌ Error generating PDF:", error);
    res
      .status(500)
      .json({ message: "Error generating PDF report", error: error.message });
  }
};

export const getReportsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId || userId === "null" || userId === "undefined") {
      return res.status(400).json({ message: "Invalid or missing userId" });
    }

    // Fetch all reports for the user, sorted by newest first
    const reports = await Report.find({ userId })
      .sort({ createdAt: -1 })
      .select("-__v"); // Exclude version field

    res.json({
      success: true,
      reports: reports || [],
      count: reports.length,
    });
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch reports",
      error: error.message,
    });
  }
};

export const getSingleReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id).select("-__v");
    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }
    res.json({
      success: true,
      report,
    });
  } catch (error) {
    console.error("Error fetching single report:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching report",
      error: error.message,
    });
  }
};

export const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId || userId === "null" || userId === "undefined") {
      return res.status(400).json({ message: "User ID is required" });
    }

    const report = await Report.findById(id);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    // Verify the report belongs to the user
    if (report.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this report" });
    }

    await Report.findByIdAndDelete(id);
    res.json({ message: "Report deleted successfully" });
  } catch (error) {
    console.error("Delete report error:", error);
    res.status(500).json({ message: "Error deleting report" });
  }
};
