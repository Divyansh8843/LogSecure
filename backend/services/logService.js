import crypto from "crypto";

export const analyzeLogs = (content, userId) => {
  if (!content || typeof content !== "string") {
    return {
      success: false,
      message: "Invalid log content.",
      totalLogs: 0,
      suspicious: [],
      ipFrequency: {},
      eventsOverTime: {},
      levelCounts: {},
      topIps: [],
    };
  }

  const lines = content.split(/\r?\n/).filter((line) => line.trim());
  const batchId = crypto.randomBytes(8).toString("hex");

  const rows = [];
  const ipFrequency = {};
  const levelCounts = { INFO: 0, WARNING: 0, ERROR: 0, DEBUG: 0 };
  const eventsOverTime = {};

  // Common log formats
  const patterns = [
    /(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})\s+(INFO|ERROR|WARNING|DEBUG)\s+(.*?)\s+(\d+\.\d+\.\d+\.\d+)/,
    /\[(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})\]\s*\[(INFO|ERROR|WARNING|DEBUG)\]\s+(.*?)\s+(\d+\.\d+\.\d+\.\d+)/,
    /(INFO|ERROR|WARNING|DEBUG)\s+(\d+\.\d+\.\d+\.\d+)\s+(.*)/,
  ];

  const isValidIP = (ip) =>
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/.test(
      ip
    );

  for (const line of lines) {
    for (const regex of patterns) {
      const match = line.match(regex);
      if (!match) continue;

      let ts, level, msg, ip;
      if (match.length >= 5) {
        ts = new Date(match[1]);
        level = match[2];
        msg = match[3];
        ip = match[4];
      } else if (match.length >= 4) {
        level = match[1];
        ip = match[2];
        msg = match[3];
        ts = new Date();
      }

      if (!isValidIP(ip)) continue;

      if (level === "WARN") level = "WARNING";

      rows.push({ userId, timestamp: ts, level, message: msg, ip, batchId });

      ipFrequency[ip] = (ipFrequency[ip] || 0) + 1;
      levelCounts[level] = (levelCounts[level] || 0) + 1;
      const key = ts.toISOString().slice(0, 16);
      eventsOverTime[key] = (eventsOverTime[key] || 0) + 1;

      break;
    }
  }

  // Smarter suspicious detection
  const suspicious = [];
  const ipStats = {};
  for (const row of rows) {
    const msg = row.message.toLowerCase();
    if (!ipStats[row.ip])
      ipStats[row.ip] = { total: 0, errors: 0, suspicious: 0 };

    ipStats[row.ip].total++;
    if (row.level === "ERROR" || msg.includes("error"))
      ipStats[row.ip].errors++;
    if (
      msg.includes("unauthorized") ||
      msg.includes("failed") ||
      msg.includes("denied")
    )
      ipStats[row.ip].suspicious++;
  }

  for (const [ip, stats] of Object.entries(ipStats)) {
    const { total, errors, suspicious: susp } = stats;
    const errorRate = total ? errors / total : 0;
    if (total >= 3 || errorRate > 0.1 || susp > 0) suspicious.push(ip);
  }

  const topIps = Object.entries(ipFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return {
    success: true,
    message: "Log analysis complete.",
    batchId,
    totalLogs: rows.length,
    ipFrequency,
    levelCounts,
    eventsOverTime,
    suspicious,
    topIps,
  };
};
