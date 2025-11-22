import { motion } from "framer-motion";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function ShareReportModal({ isOpen, onClose, reportId }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleShare = async () => {
    if (!email || !email.includes('@')) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const base = import.meta.env.VITE_API_BASE_URL;
      const frontendUrl = window.location.origin;
      // Use dashboard view URL instead of download URL for email
      const reportUrl = `${frontendUrl}/dashboard?reportId=${reportId}`;

      await axios.post(
        `${base}/api/reports/share`,
        { 
          email, 
          reportUrl,
          reportId,
          userName: localStorage.getItem("userName") || "User"
        },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      toast.success(`✅ Report shared successfully with ${email}`);
      setEmail(""); // Clear email field
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to share report";
      toast.error(`❌ ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl w-full max-w-md"
      >
        <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100">
          Share Report via Email
        </h2>
        <input
          type="email"
          placeholder="Enter recipient email"
          className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md mb-4 bg-gray-50 dark:bg-gray-900"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleShare}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Sharing..." : "Share"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
