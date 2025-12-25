
import { useState } from "react";
import { motion } from "framer-motion";

export default function Diseases() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handlePredict = async () => {
    if (!image) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("file", image);

    try {
      const response = await fetch("/api/predict-disease", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setResult(data);

      try {
        localStorage.setItem("agro_last_disease_result", JSON.stringify(data));
      } catch (e) {
        console.error("Failed to cache disease result", e);
      }
    } catch (error) {
      console.error("Error detecting disease:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewPrediction = () => {
    setImage(null);
    setPreview(null);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-light py-12 px-6 flex flex-col items-center">
      <motion.h2 
        className="text-4xl font-bold text-primary mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        🦠 Disease Detection
      </motion.h2>

      <motion.div 
        className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:bg-gray-50 transition cursor-pointer relative">
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageChange} 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          {preview ? (
            <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-lg shadow-md" />
          ) : (
            <div className="text-gray-500">
              <div className="text-6xl mb-4">📸</div>
              <p className="text-lg font-medium">Click or Drag to Upload Image</p>
              <p className="text-sm">Supported formats: JPG, PNG</p>
            </div>
          )}
        </div>

        <button 
          onClick={handlePredict}
          disabled={loading}
          className="sm:col-span-2 w-full bg-green-800 text-white py-3 rounded-xl font-bold text-lg hover:bg-green-900 active:bg-white active:text-black transition disabled:opacity-50 mt-4 shadow-lg"
        >
          {loading ? "Analyzing..." : "Detect Disease"}
        </button>

        {result && (
          <motion.div 
            className="mt-8 p-6 bg-green-50 rounded-2xl border border-green-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-2xl font-bold text-primary mb-2">Analysis Result</h3>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700 font-medium">Disease:</span>
              <span className="text-xl font-bold text-red-600">{result.disease}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-medium">Confidence:</span>
              <span className="text-lg font-semibold text-primary">{result.confidence}%</span>
            </div>
            <button
              onClick={handleNewPrediction}
              className="mt-4 px-4 py-2 rounded-xl border border-green-700 text-green-800 font-semibold hover:bg-green-700 hover:text-white transition"
            >
              New Prediction
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}