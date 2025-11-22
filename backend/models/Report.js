import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      default: "System Log Report",
    },
    filename: {
      type: String,
      default: "",
    },
    summary: {
      type: String,
    },
    ipFrequency: {
      type: Object,
      default: {},
    },
    eventsOverTime: {
      type: Object,
      default: {},
    },
    levelCounts: {
      type: Object,
      default: {},
    },
    topIps: {
      type: Array,
      default: [],
    },
    suspicious: {
      type: Array,
      default: [],
    },
    suspiciousIPs: {
      type: Number,
      default: 0,
    },
    totalLogs: {
      type: Number,
      default: 0,
    },
    errorLogs: {
      type: Number,
      default: 0,
    },
    fileUrl: {
      type: String,
    },
    charts: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

// ✅ Export as default
const Report = mongoose.model("Report", reportSchema);
export default Report;
