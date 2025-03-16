'use client';
import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!file) return;
  
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      const response = await axios.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      console.log("🔥 Full API Response:", response);
      console.log("📜 Response Data:", response.data);
  
      setData(response.data);
    } catch (error) {
      console.error("❌ Upload failed:", error);
      setError("An error occurred during upload. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="relative w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-black">
      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-700 via-blue-500 to-indigo-900 opacity-20 blur-3xl"></div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 p-8 max-w-lg w-full bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20"
      >
        <h2 className="text-2xl font-semibold text-white mb-4 text-center">
          Upload Business Card
        </h2>

        <div className="flex flex-col items-center space-y-4">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
            className="file:bg-blue-500 file:text-white file:px-4 file:py-2 file:rounded-lg file:border-none cursor-pointer bg-gray-900 text-white px-3 py-2 rounded-lg w-full"
          />
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleUpload}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-all duration-300 disabled:bg-gray-500"
            disabled={loading || !file}
          >
            {loading ? "Uploading..." : "Upload & Analyze"}
          </motion.button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
            <p className="text-white text-sm">{error}</p>
          </div>
        )}

        {data && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-6 p-4 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 shadow-lg"
          >
            <h3 className="text-lg font-bold text-white">Raw API Response:</h3>
            <pre className="text-white text-sm overflow-x-auto bg-gray-800 p-3 rounded-lg border border-white/10">
              {JSON.stringify(data, null, 2)}
            </pre>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
