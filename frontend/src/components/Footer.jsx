import {
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-20 bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10 text-left text-gray-700 dark:text-gray-300">
        {/* ===== Brand Info ===== */}
        <div>
          <h2 className="text-2xl font-bold text-blue-600 mb-3">
            SecureLog Analyzer
          </h2>
          <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            Empowering students and developers to analyze logs securely and
            efficiently with interactive visualization and anomaly detection.
          </p>
        </div>

        {/* ===== Quick Links ===== */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/" className="hover:text-blue-600 transition-colors">
                Home
              </a>
            </li>
            <li>
              <a
                href="#features"
                className="hover:text-blue-600 transition-colors"
              >
                Features
              </a>
            </li>
            <li>
              <a href="#how" className="hover:text-blue-600 transition-colors">
                How It Works
              </a>
            </li>
            <li>
              <a
                href="/dashboard"
                className="hover:text-blue-600 transition-colors"
              >
                Dashboard
              </a>
            </li>
          </ul>
        </div>

        {/* ===== Contact Section ===== */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
            Contact Us
          </h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <Mail size={16} className="text-blue-600" />
              <a
                href="mailto:contact@securelog.com"
                className="hover:text-blue-600 transition-colors"
              >
                contact@securelog.com
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} className="text-blue-600" />
              <span>+91 8817XXXXXX</span>
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={16} className="text-blue-600" />
              <span>Gwalior, India</span>
            </li>
          </ul>
        </div>

        {/* ===== Social Links ===== */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
            Connect With Us
          </h3>
          <div className="flex gap-4 mt-2">
            <a
              href="https://github.com/Divyansh8843"
              target="_blank"
              rel="noreferrer"
              className="hover:text-blue-600 transition-colors"
            >
              <Github size={20} />
            </a>
            <a
              href="https://www.linkedin.com/in/divyansh-agrawal-4556a0299"
              target="_blank"
              rel="noreferrer"
              className="hover:text-blue-600 transition-colors"
            >
              <Linkedin size={20} />
            </a>
            <a
              href="https://x.com/Ag15277Divyansh"
              target="_blank"
              rel="noreferrer"
              className="hover:text-blue-600 transition-colors"
            >
              <Twitter size={20} />
            </a>
            <a
              href="https://instagram.com/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-blue-600 transition-colors"
            >
              <Instagram size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* ===== Bottom Bar ===== */}
      <div className="mt-10 border-t border-gray-300 dark:border-gray-800 pt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        <p className="mt-1 text-base">
          Developed with ❤️ by{" "}
          <span className="font-semibold">Divyansh Agrawal</span>
        </p>
        <p>
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold text-blue-600">
            SecureLog Analyzer
          </span>{" "}
        </p>
      </div>
    </footer>
  );
}
