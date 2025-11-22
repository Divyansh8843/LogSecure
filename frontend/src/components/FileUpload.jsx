import { useState } from "react";
import axios from "axios";
export default function FileUpload({ setStats }) {
  const [file, setFile] = useState(null);
  const token = localStorage.getItem("token");

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("logFile", file);
    const { data } = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/api/logs/upload`,
      formData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setStats(data);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Upload Log File</h2>
      <form onSubmit={handleUpload} className="flex gap-3 items-center">
        <input
          type="file"
          accept=".txt"
          onChange={(e) => setFile(e.target.files[0])}
          required
          className="text-gray-900 dark:text-gray-100"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Analyze
        </button>
      </form>
    </div>
  );
}
