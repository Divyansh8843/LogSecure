import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { LogIn } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/login`,
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );
      login(res.data.token);
      localStorage.setItem("userId", res.data._id);
      localStorage.setItem("userEmail", res.data.email);

      navigate("/profile");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <form
        onSubmit={handleLogin}
        className="bg-gray-800 p-8 rounded-xl shadow-md w-80"
      >
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <LogIn /> Login
        </h2>
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-3 text-black rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-3 text-black rounded"
          required
        />
        <button className="bg-green-600 hover:bg-green-700 w-full p-2 rounded">
          Sign In
        </button>
        <p className="text-sm mt-3">
          No account?{" "}
          <Link to="/register" className="text-blue-400">
            Register
          </Link>
        </p>
        <p className="text-sm mt-2 text-center">
          <Link to="/forgot-password" className="text-gray-400 hover:underline">
            Forgot password?
          </Link>
        </p>
      </form>
    </div>
  );
}
