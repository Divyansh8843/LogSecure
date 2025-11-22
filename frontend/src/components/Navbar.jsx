import { Link, useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3 relative">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-600">
          Secure<span className="text-gray-800 dark:text-gray-100">Log</span>
        </Link>

        {/* Center Links */}
        <div className="hidden md:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2">
          <Link
            to="/"
            className="font-medium hover:text-blue-600 dark:hover:text-blue-400"
          >
            Home
          </Link>
          {isLoggedIn && (
            <>
              <Link
                to="/dashboard"
                className="font-medium hover:text-blue-600 dark:hover:text-blue-400"
              >
                Dashboard
              </Link>
              <Link
                to="/profile"
                className="font-medium hover:text-blue-600 dark:hover:text-blue-400"
              >
                Profile
              </Link>
              <Link
                to="/reports"
                className="font-medium hover:text-blue-600 dark:hover:text-blue-400"
              >
                Reports
              </Link>
              <Link
                to="/insights"
                className="font-medium hover:text-blue-600 dark:hover:text-blue-400"
              >
                Insights
              </Link>
              <Link
                to="/workflow"
                className="font-medium hover:text-blue-600 dark:hover:text-blue-400"
              >
                Workflow
              </Link>
            </>
          )}
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {!isLoggedIn ? (
            <Link
              to="/login"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Sign In
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
