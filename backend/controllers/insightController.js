import Log from "../models/Log.js";
import Report from "../models/Report.js";

export const generateInsights = async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // ✅ Fetch real-time data from reports (primary source)
    const reports = await Report.find({ userId }).sort({ createdAt: -1 });
    
    // Calculate aggregated insights from all reports
    let totalLogs = 0;
    let totalErrorLogs = 0;
    let totalSuspiciousIPs = 0;
    const allSuspiciousIPs = new Set();
    
    reports.forEach(report => {
      totalLogs += report.totalLogs || 0;
      totalErrorLogs += report.errorLogs || 0;
      totalSuspiciousIPs += report.suspiciousIPs || 0;
      
      // Collect unique suspicious IPs
      if (report.suspicious && Array.isArray(report.suspicious)) {
        report.suspicious.forEach(ip => allSuspiciousIPs.add(ip));
      }
    });

    // Also check logs for additional data
    const logs = await Log.find({ userId });
    const logErrorCount = logs.filter((l) => l.level === "ERROR").length;
    const logSuspiciousCount = logs.filter((l) => l.isSuspicious).length;

    // Use report data as primary, fallback to logs if no reports
    const finalTotalLogs = totalLogs > 0 ? totalLogs : logs.length;
    const finalErrorLogs = totalErrorLogs > 0 ? totalErrorLogs : logErrorCount;
    const finalSuspiciousIPs = totalSuspiciousIPs > 0 ? totalSuspiciousIPs : (allSuspiciousIPs.size > 0 ? allSuspiciousIPs.size : logSuspiciousCount);

    const insightSummary = `
      Total Reports Generated: ${reports.length}
      Total Logs Analyzed: ${finalTotalLogs}
      Total Errors Found: ${finalErrorLogs}
      Suspicious IPs Detected: ${finalSuspiciousIPs}
      System Health: ${
        finalSuspiciousIPs > 10 ? "⚠️ High Risk Detected" 
        : finalSuspiciousIPs > 5 ? "⚠️ Medium Risk Detected" 
        : "✅ Stable"
      }
    `;

    let recommendation = "No critical anomalies detected.";
    if (finalSuspiciousIPs > 10) {
      recommendation = "High number of suspicious IPs detected. Immediate action required: Review firewall rules, implement IP blocking, and investigate potential security threats.";
    } else if (finalSuspiciousIPs > 5) {
      recommendation = "Moderate number of suspicious IPs detected. Review your firewall and consider implementing rate limiting and IP blocking for repeated offenders.";
    } else if (finalErrorLogs > 100) {
      recommendation = "High error rate detected. Review application logs and error handling mechanisms to improve system stability.";
    } else if (finalErrorLogs > 50) {
      recommendation = "Elevated error rate detected. Monitor error patterns and consider reviewing application configuration.";
    }

    res.json({
      success: true,
      totalLogs: finalTotalLogs,
      errorLogs: finalErrorLogs,
      suspiciousIPs: finalSuspiciousIPs,
      totalReports: reports.length,
      summary: insightSummary.trim(),
      recommendation,
    });
  } catch (err) {
    console.error("Insight generation error:", err);
    res
      .status(500)
      .json({ message: "Insight generation failed", error: err.message });
  }
};
