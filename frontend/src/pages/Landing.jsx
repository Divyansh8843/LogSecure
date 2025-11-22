import { Link } from "react-router-dom";
import { Shield, BarChart3, UploadCloud, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

export default function Landing() {
  const { isLoggedIn } = useAuth();

  return (
    <div className="text-center space-y-24 overflow-hidden">
      {/* ================= HERO SECTION ================= */}
      <section
        className="relative min-h-[90vh] flex flex-col justify-center items-center py-16 bg-gradient-to-b from-blue-200 to-white dark:from-gray-600 dark:to-gray- bg-cover bg-center"
        style={{
          backgroundImage: "url('')",
        }}
      >
        {/* Background glow effect */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)]"></div>

        {/* Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-200 text-sm shadow-sm">
            <Shield size={16} /> Secure Log Analyzer
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-6 text-5xl md:text-7xl font-extrabold leading-tight"
          >
            Analyze <span className="text-blue-600">Logs</span> Intelligently
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-6 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
          >
            Upload your log files securely, visualize insights, and identify
            suspicious patterns instantly with powerful analytics.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, duration: 0.7 }}
            className="mt-8 flex flex-wrap justify-center gap-4"
          >
            {!isLoggedIn ? (
              <>
                <Link
                  to="/register"
                  className="px-6 py-3 text-lg rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-md"
                >
                  Get Started
                </Link>
                <a
                  href="#features"
                  className="px-6 py-3 text-lg rounded-md border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                >
                  Explore Features
                </a>
              </>
            ) : (
              <Link
                to="/dashboard"
                className="px-6 py-3 text-lg rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-md"
              >
                Go to Dashboard
              </Link>
            )}
          </motion.div>
        </motion.div>
      </section>

      {/* ================= FEATURES ================= */}
      <section id="features" className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold mb-10 text-gray-900 dark:text-gray-100"
        >
          Key Features
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <UploadCloud size={36} />,
              title: "Cloud Upload",
              text: "Securely upload logs via drag & drop, powered by Cloudinary.",
            },
            {
              icon: <BarChart3 size={36} />,
              title: "Visual Insights",
              text: "Beautiful analytics with bar, line, doughnut, and polar charts.",
            },
            {
              icon: <Zap size={36} />,
              title: "Smart Detection",
              text: "Automatic identification of repeated or suspicious IPs.",
            },
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: i * 0.2 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl transition-shadow"
            >
              <div className="text-blue-600 dark:text-blue-400 mb-3 flex justify-center">
                {f.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                {f.text}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section id="how" className="max-w-6xl mx-auto ">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold mb-10 text-gray-900 dark:text-gray-100"
        >
          How It Works
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: "01",
              title: "Login",
              text: "Create your secure account or sign in.",
            },
            {
              step: "02",
              title: "Upload",
              text: "Drag and drop your log files to the analyzer.",
            },
            {
              step: "03",
              title: "Analyze",
              text: "Instantly visualize results and track suspicious patterns.",
            },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: i * 0.2 }}
              viewport={{ once: true }}
              className="p-6 border rounded-2xl bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-blue-600 dark:text-blue-400 font-bold text-2xl">
                {s.step}
              </div>
              <h4 className="text-xl font-semibold mt-2">{s.title}</h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                {s.text}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= CALL TO ACTION ================= */}
      <section className="text-center bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 py-16">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl font-bold mb-3 text-gray-900 dark:text-white">
            Start Securing Your Systems Today
          </h3>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6">
            Upload and analyze logs within seconds. Get detailed insights with
            our AI-powered log analyzer designed for information security
            projects.
          </p>
          <Link
            to={isLoggedIn ? "/dashboard" : "/register"}
            className="inline-block px-8 py-3 text-lg bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md"
          >
            {isLoggedIn ? "Go to Dashboard" : "Create Free Account"}
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
