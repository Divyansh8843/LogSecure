import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/register`,
        {
          name,
          email,
          password,
        }
      );
      login(res.data.token);
      localStorage.setItem("userId", res.data._id);
      localStorage.setItem("userEmail", res.data.email);
      alert("Registration successful!");
      navigate("/profile");
    } catch {
      alert("User already exists");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <form
        onSubmit={handleRegister}
        className="bg-gray-800 p-8 rounded-xl shadow-md w-80"
      >
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <UserPlus /> Register
        </h2>
        <input
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 mb-3 text-black rounded"
          required
        />
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
        <button className="bg-blue-600 hover:bg-blue-700 w-full p-2 rounded">
          Sign Up
        </button>
        <p className="text-sm mt-3">
          Already have an account?{" "}
          <Link to="/" className="text-green-400">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
