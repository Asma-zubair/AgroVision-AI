import { useState } from "react";
import { motion } from "framer-motion";

export default function Crop() {
  const SOIL_TYPES = ["Sandy", "Loamy", "Clay", "Black", "Red"];
  const SEASONS = ["Winter", "Summer", "Monsoon"];
  const RAINFALL_LEVELS = ["Low", "Medium", "High"];
  const WEATHERS = ["Cool & Dry", "Warm", "Hot & Humid", "Sunny"];
  const PH_RANGES = ["Acidic", "Neutral", "Alkaline"];

  const [formData, setFormData] = useState({
    soil_type: "Loamy",
    season: "Monsoon",
    rainfall_level: "Medium",
    weather: "Warm",
    ph_range: "Neutral",
  });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/predict-crop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setPrediction(data.recommendations);

      try {
        localStorage.setItem("agro_last_crop_result", JSON.stringify(data));
      } catch (e) {
        console.error("Failed to cache crop result", e);
      }
    } catch (error) {
      console.error("Error predicting crop:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-light py-12 px-6 flex flex-col items-center">
      <motion.h2 
        className="text-4xl font-bold text-primary mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        🌾 Crop Recommendation
      </motion.h2>
      
      <motion.div 
        className="bg-white rounded-3xl shadow-2xl p-8 max-w-4xl w-full flex flex-col md:flex-row gap-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <form onSubmit={handleSubmit} className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SelectField label="Soil Type" name="soil_type" value={formData.soil_type} onChange={handleChange} options={SOIL_TYPES} />
          <SelectField label="Season" name="season" value={formData.season} onChange={handleChange} options={SEASONS} />
          <SelectField label="Rainfall Level" name="rainfall_level" value={formData.rainfall_level} onChange={handleChange} options={RAINFALL_LEVELS} />
          <SelectField label="Weather" name="weather" value={formData.weather} onChange={handleChange} options={WEATHERS} />
          <SelectField label="pH Range" name="ph_range" value={formData.ph_range} onChange={handleChange} options={PH_RANGES} className="sm:col-span-2" />
          
          <button 
            type="submit" 
            disabled={loading}
            className="sm:col-span-2 w-full bg-green-800 text-white py-3 rounded-xl font-bold text-lg hover:bg-green-900 active:bg-white active:text-black transition disabled:opacity-50 mt-4 shadow-lg"
          >
            {loading ? "Analyzing..." : "Predict Best Crop"}
          </button>
        </form>

        <div className="md:w-1/3 flex flex-col items-center justify-center bg-green-50 rounded-2xl p-6 border border-green-100">
          {prediction ? (
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Top Recommendations</h3>
              <ul className="space-y-2">
                {prediction.map((item, i) => (
                  <li key={i} className="text-lg">
                    <span className="font-bold text-primary capitalize">{item.crop}</span>
                    <span className="text-gray-500"> — {item.confidence}%</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 text-5xl">🌱</div>
            </motion.div>
          ) : (
            <div className="text-center text-gray-400">
              <div className="text-6xl mb-4">🔍</div>
              <p>Enter soil details to get a recommendation.</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function SelectField({ label, name, value, onChange, options, className = "" }) {
  return (
    <div className={`flex flex-col ${className}`}>
      <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition bg-white"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}