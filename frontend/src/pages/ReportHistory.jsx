import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Download,
  Share2,
  Eye,
  Trash2,
  RefreshCw,
  Calendar,
  FileText,
  AlertCircle,
} from "lucide-react";
import ShareReportModal from "../components/ShareReportModal";

export default function ReportHistory() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");

  // Fetch reports on page load
  useEffect(() => {
    fetchReports();
  }, []);

  // Auto-refresh reports every 30s for real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      fetchReports();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchReports = async () => {
    try {
      const userId = localStorage.getItem("userId");

      if (!userId || userId === "null" || userId === "undefined") {
        toast.error("⚠️ Missing user session. Please log in again.");
        localStorage.clear();
        navigate("/login");
        return;
      }

      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/reports/user/${userId}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      // Sort reports by creation date (newest first)
      const sortedReports = (res.data.reports || []).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setReports(sortedReports);
    } catch (error) {
      console.error("Error fetching reports:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to load report history";
      toast.error(`⚠️ ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const refreshReports = async () => {
    try {
      setRefreshing(true);
      await fetchReports();
      toast.success("✅ Reports refreshed successfully");
    } catch (error) {
      toast.error("❌ Failed to refresh reports");
    } finally {
      setRefreshing(false);
    }
  };

  const handleDownload = async (id) => {
    try {
      toast.loading("⬇️ Preparing download...");

      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/reports/download/${id}`,
        {
          responseType: "blob",
        }
      );

      // Create blob and download
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `report-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.dismiss();
      toast.success("✅ Report downloaded successfully");
    } catch (error) {
      toast.dismiss();
      console.error("Download error:", error);
      toast.error("❌ Failed to download report");
    }
  };

  const handleShare = (id) => {
    setSelectedReportId(id);
    setShowModal(true);
  };

  const handleView = async (id) => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId || userId === "null" || userId === "undefined") {
        toast.error("⚠️ Missing user session. Please log in again.");
        localStorage.clear();
        navigate("/login");
        return;
      }

      toast.loading("📋 Loading report...");
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/reports/${id}`
      );
      toast.dismiss();

      if (res.data.report) {
        toast.success("✅ Report loaded successfully");
        navigate(`/dashboard?reportId=${id}`);
      } else {
        throw new Error("Report not found");
      }
    } catch (err) {
      toast.dismiss();
      console.error("View error:", err);
      const errorMessage =
        err.response?.data?.message || "Failed to load report details";
      toast.error(`❌ ${errorMessage}`);
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this report? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setDeleteLoading(id);
      const userId = localStorage.getItem("userId");

      if (!userId || userId === "null" || userId === "undefined") {
        toast.error("⚠️ Missing user session. Please log in again.");
        localStorage.clear();
        navigate("/login");
        return;
      }

      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/reports/${id}`,
        {
          data: { userId },
        }
      );

      // Remove the deleted report from the list and refresh to get updated count
      setReports(reports.filter((report) => report._id !== id));
      // Refresh to ensure total count is updated
      await fetchReports();
      toast.success("✅ Report deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to delete report";
      toast.error(`❌ ${errorMessage}`);
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return date.toLocaleDateString();
  };

  const getStatusColor = (report) => {
    const suspiciousIPs = report.suspiciousIPs || 0;
    const errorLogs = report.errorLogs || 0;

    if (suspiciousIPs > 10 || errorLogs > 100)
      return "border-red-500 bg-red-50 dark:bg-red-900";
    if (suspiciousIPs > 5 || errorLogs > 50)
      return "border-yellow-500 bg-yellow-50 dark:bg-yellow-900";
    return "border-green-500 bg-green-50 dark:bg-green-900";
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-6 py-10 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            📄 Report History
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            View and manage your generated log analysis reports.
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="flex justify-between items-center mb-6"
        >
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Total Reports:{" "}
            <span className="font-semibold">{reports.length}</span>
          </div>
          <button
            onClick={refreshReports}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : reports.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <FileText size={64} className="mx-auto" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">
              No reports found in your history.
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mb-6">
              Start by analyzing a log file to generate your first report.
            </p>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Dashboard
            </button>
          </motion.div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reports.map((report, index) => (
              <motion.div
                key={report._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all border-2 ${getStatusColor(
                  report
                )}`}
              >
                {/* Status Indicator */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        report.suspiciousIPs > 10 || report.errorLogs > 100
                          ? "bg-red-500"
                          : report.suspiciousIPs > 5 || report.errorLogs > 50
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                    ></div>
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      {report.suspiciousIPs > 10 || report.errorLogs > 100
                        ? "High Risk"
                        : report.suspiciousIPs > 5 || report.errorLogs > 50
                        ? "Medium Risk"
                        : "Low Risk"}
                    </span>
                  </div>
                </div>

                <h3
                  className="text-lg font-semibold text-gray-900 dark:text-white mb-2 truncate"
                  title={report.filename || report.title || "Untitled Report"}
                >
                  {report.filename || report.title || "Untitled Report"}
                </h3>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Calendar size={14} className="mr-2" />
                    {formatDate(report.createdAt)}
                  </div>

                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-500">
                    <span>
                      Total Logs:{" "}
                      <strong>{report.totalLogs?.toLocaleString() || 0}</strong>
                    </span>
                    <span>
                      Errors:{" "}
                      <strong className="text-red-600 dark:text-red-400">
                        {report.errorLogs?.toLocaleString() || 0}
                      </strong>
                    </span>
                    <span>
                      Suspicious:{" "}
                      <strong className="text-orange-600 dark:text-orange-400">
                        {report.suspiciousIPs?.toLocaleString() || 0}
                      </strong>
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleView(report._id)}
                      className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      title="View Report"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => handleDownload(report._id)}
                      className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      title="Download Report"
                    >
                      <Download size={16} />
                    </button>
                    <button
                      onClick={() => handleShare(report._id)}
                      className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      title="Share Report"
                    >
                      <Share2 size={16} />
                    </button>
                  </div>
                  <button
                    onClick={() => handleDelete(report._id)}
                    disabled={deleteLoading === report._id}
                    className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Delete Report"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Report Summary */}
        {!loading && reports.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <AlertCircle size={20} className="mr-2" />
              Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {reports.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Total Reports
                </div>
              </div>
              <div className="bg-red-50 dark:bg-red-900 rounded-lg p-4">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {
                    reports.filter(
                      (r) => r.suspiciousIPs > 10 || r.errorLogs > 100
                    ).length
                  }
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  High Risk Reports
                </div>
              </div>
              <div className="bg-green-50 dark:bg-green-900 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {
                    reports.filter(
                      (r) => r.suspiciousIPs <= 5 && r.errorLogs <= 50
                    ).length
                  }
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Low Risk Reports
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {showModal && (
          <ShareReportModal
            isOpen={showModal}
            reportId={selectedReportId}
            onClose={() => setShowModal(false)}
          />
        )}
      </div>
    </div>
  );
}
