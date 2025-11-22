import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Lock } from "lucide-react";

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/reset-password/${token}`,
        { password }
      );
      setMessage(res.data.message);
      setTimeout(() => navigate("/"), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Invalid or expired token.");
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
          <Lock /> Reset Password
        </h2>
        <p className="text-sm text-gray-300 mb-4">
          Enter your new password below to reset your account.
        </p>
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 mb-3 text-black rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 w-full p-2 rounded"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>

        {message && (
          <p className="mt-3 text-center text-sm text-green-400">{message}</p>
        )}
      </form>
    </div>
  );
}
