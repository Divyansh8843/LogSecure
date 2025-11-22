import { useEffect, useState } from "react";
import DropzoneUpload from "../components/DropzoneUpload";
import { Bar, Line, Doughnut, PolarArea } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement,
  RadialLinearScale,
} from "chart.js";
import { AlertCircle, CheckCircle, Info } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement,
  RadialLinearScale
);

export default function Dashboard() {
  const [report, setReport] = useState({
    ipFrequency: {},
    eventsOverTime: {},
    levelCounts: {},
    topIps: [],
    suspicious: [],
    suspiciousCount: 0,
    totalLogs: 0,
    fileUrl: "",
    success: false,
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const colors = [
    "#3b82f6", // blue
    "#22c55e", // green
    "#f97316", // orange
    "#eab308", // yellow
    "#a855f7", // purple
    "#ec4899", // pink
  ];

  // ✅ Handle log analysis completion and save report
  const handleAnalysisComplete = async (data) => {
    setLoading(false);
    if (!data || data.success === false) {
      setError(data?.message || "Analysis failed. Please check your log file.");
      setReport({
        ipFrequency: {},
        eventsOverTime: {},
        levelCounts: {},
        topIps: [],
        suspicious: [],
        totalLogs: 0,
        fileUrl: "",
        success: false,
      });
    } else {
      setReport({
        ipFrequency: data?.ipFrequency || {},
        eventsOverTime: data?.eventsOverTime || {},
        levelCounts: data?.levelCounts || {},
        topIps: data?.topIps || [],
        suspicious: data?.suspicious || [],
        totalLogs: data?.totalLogs ?? 0,
        fileUrl: data?.fileUrl || "",
        success: !!data?.success,
      });
      setError(null);

      // ✅ Automatically save report after successful analysis
      try {
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");

        if (userId && token) {
          const reportData = {
            userId,
            summary: `Log analysis completed: ${
              data.totalLogs
            } logs processed, ${
              data.suspicious?.length || 0
            } suspicious IPs detected`,
            ipFrequency: data.ipFrequency || {},
            levelCounts: data.levelCounts || {},
            suspiciousIPs: data.suspicious?.length || 0,
            totalLogs: data.totalLogs || 0,
            errorLogs: data.levelCounts?.ERROR || 0,
            filename:
              data.filename || `log-analysis-${new Date().toISOString()}`,
            fileUrl: data.fileUrl || "",
            charts: {
              ipFrequency: data.ipFrequency || {},
              levelCounts: data.levelCounts || {},
              eventsOverTime: data.eventsOverTime || {},
            },
          };

          const saveResponse = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/api/reports/generate`,
            reportData,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (saveResponse.data && saveResponse.data.report) {
            toast.success("✅ Report saved successfully!");
          }
        }
      } catch (error) {
        console.error("Failed to save report:", error);
        // Don't show error toast as analysis was successful
      }
    }
  };

  const handleAnalysisError = (errorMessage) => {
    setLoading(false);
    setError(errorMessage || "Something went wrong during analysis.");
    setReport((prev) => ({ ...prev, success: false }));
  };

  // ✅ If navigated from Report History, load report by ID
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const reportId = params.get("reportId");
    if (!reportId) return;

    const fetchSavedReport = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/reports/${reportId}`
        );
        const data = await res.json();
        if (!res.ok || !data?.report) {
          throw new Error(data?.message || "Failed to load report");
        }

        const charts = data.report.charts || {};
        const ipFrequency = charts.ipFrequency || data.report.ipFrequency || {};
        const levelCounts = charts.levelCounts || data.report.levelCounts || {};
        const eventsOverTime =
          charts.eventsOverTime || data.report.eventsOverTime || {};
        const suspiciousIPs = data.report.suspiciousIPs || 0;

        // Calculate totalLogs from ipFrequency or use stored value
        const totalLogs =
          data.report.totalLogs ||
          Object.values(ipFrequency).reduce(
            (sum, v) => sum + (typeof v === "number" ? v : 0),
            0
          );

        // Get topIps from report or calculate from ipFrequency
        const topIps =
          data.report.topIps && data.report.topIps.length > 0
            ? data.report.topIps
            : Object.entries(ipFrequency)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5);

        setReport({
          ipFrequency,
          eventsOverTime,
          levelCounts,
          topIps,
          suspicious: data.report.suspicious || [],
          suspiciousCount: suspiciousIPs || 0,
          totalLogs,
          fileUrl: data.report.fileUrl || "",
          success: true,
        });
      } catch (err) {
        setError(err.message || "Failed to load report");
      } finally {
        setLoading(false);
      }
    };

    fetchSavedReport();
  }, []);

  // ✅ Prevent unnecessary page refresh after analysis
  // The page should not auto-refresh after analysis completes
  // Reports are saved automatically, so no refresh needed

  // ✅ Chart Configs (Safe fallback)
  const barData = {
    labels: Object.keys(report?.ipFrequency || {}),
    datasets: [
      {
        label: "IP Frequency",
        data: Object.values(report?.ipFrequency || {}),
        backgroundColor: colors,
        borderRadius: 8,
      },
    ],
  };

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom" },
      tooltip: { mode: "index", intersect: false },
    },
  };

  const cartesianOptions = {
    ...commonOptions,
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true },
    },
  };

  const lineData = {
    labels: Object.keys(report?.eventsOverTime || {}),
    datasets: [
      {
        label: "Events Over Time",
        data: Object.values(report?.eventsOverTime || {}),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59,130,246,0.3)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const doughnutData = {
    labels: Object.keys(report?.levelCounts || {}),
    datasets: [
      {
        data: Object.values(report?.levelCounts || {}),
        backgroundColor: colors,
        borderWidth: 2,
      },
    ],
  };

  const polarData = {
    labels: (report?.topIps || []).map(([ip]) => ip),
    datasets: [
      {
        data: (report?.topIps || []).map(([_, c]) => c),
        backgroundColor: colors,
      },
    ],
  };

  return (
    <div className="space-y-6 px-4 md:px-8 py-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          Log Analyzer Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 md:mt-0">
          Visualize insights from uploaded log data
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: "Total Logs",
            value: report?.totalLogs ?? "—",
            color: "text-blue-500",
          },
          {
            title: "Suspicious IPs",
            value: Array.isArray(report?.suspicious)
              ? report.suspicious.length
              : report?.suspiciousCount || 0,
            color: "text-red-500",
          },
          {
            title: "Errors",
            value: report?.levelCounts?.ERROR || 0,
            color: "text-yellow-500",
          },
          {
            title: "Cloud File",
            value: report?.fileUrl ? (
              <a
                className="text-blue-600 underline break-all"
                href={report.fileUrl}
                target="_blank"
                rel="noreferrer"
              >
                Open
              </a>
            ) : (
              "—"
            ),
            color: "text-indigo-500",
          },
        ].map((card, idx) => (
          <div
            key={idx}
            className="p-5 rounded-xl shadow-md hover:shadow-lg bg-white dark:bg-gray-800 transition-all duration-200 transform hover:-translate-y-1"
          >
            <h4 className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-2">
              {card.title}
            </h4>
            <div className={`text-3xl font-semibold ${card.color}`}>
              {card.value}
            </div>
          </div>
        ))}
      </div>

      {/* File Upload Section */}
      <div className="rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 p-6 bg-white dark:bg-gray-800 shadow-sm">
        <DropzoneUpload
          onAnalyzed={handleAnalysisComplete}
          onError={handleAnalysisError}
          onLoading={setLoading}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
          <div>
            <h3 className="font-semibold text-red-800 dark:text-red-200">
              Analysis Error
            </h3>
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 flex items-center gap-3">
          <Info className="text-blue-500 animate-spin" size={20} />
          <div>
            <h3 className="font-semibold text-blue-800 dark:text-blue-200">
              Analyzing Log File
            </h3>
            <p className="text-blue-600 dark:text-blue-400 text-sm">
              Please wait while we process your file...
            </p>
          </div>
        </div>
      )}

      {/* Success Message */}
      {report?.success && !loading && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle className="text-green-500" size={20} />
          <div>
            <h3 className="font-semibold text-green-800 dark:text-green-200">
              Analysis Complete
            </h3>
            <p className="text-green-600 dark:text-green-400 text-sm">
              Successfully analyzed {report.totalLogs} log entries. Found{" "}
              {report.suspicious?.length || 0} suspicious IPs.
            </p>
          </div>
        </div>
      )}

      {/* Charts */}
      {report?.success && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-4 rounded-xl shadow-md bg-white dark:bg-gray-800 h-72 md:h-96">
            <h4 className="mb-3 font-semibold text-gray-700 dark:text-gray-200">
              IP Frequency (Bar)
            </h4>
            <Bar data={barData} options={cartesianOptions} />
          </div>

          <div className="p-4 rounded-xl shadow-md bg-white dark:bg-gray-800 h-72 md:h-96">
            <h4 className="mb-3 font-semibold text-gray-700 dark:text-gray-200">
              Events Over Time (Line)
            </h4>
            <Line data={lineData} options={cartesianOptions} />
          </div>

          <div className="p-4 rounded-xl shadow-md bg-white dark:bg-gray-800 h-72 md:h-96">
            <h4 className="mb-3 font-semibold text-gray-700 dark:text-gray-200">
              Level Distribution (Doughnut)
            </h4>
            <Doughnut data={doughnutData} options={commonOptions} />
          </div>

          <div className="p-4 rounded-xl shadow-md bg-white dark:bg-gray-800 h-72 md:h-96">
            <h4 className="mb-3 font-semibold text-gray-700 dark:text-gray-200">
              Top IPs (Polar Area)
            </h4>
            <PolarArea data={polarData} options={commonOptions} />
          </div>
        </div>
      )}
    </div>
  );
}
