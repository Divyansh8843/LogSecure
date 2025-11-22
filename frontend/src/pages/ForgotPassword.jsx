import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/forgot-password`,
        { email }
      );
      setMessage(res.data.message);
      setTimeout(() => navigate("/"), 4000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to send reset link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded-xl shadow-md w-96"
      >
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <Mail /> Forgot Password
        </h2>
        <p className="text-sm text-gray-300 mb-4">
          Enter your registered email. We’ll send a password reset link.
        </p>
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 mb-3 text-black rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 w-full p-2 rounded"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        {message && (
          <p className="mt-3 text-center text-sm text-green-400">{message}</p>
        )}
      </form>
    </div>
  );
}
