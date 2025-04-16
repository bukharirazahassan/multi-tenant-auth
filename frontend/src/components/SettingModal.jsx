import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const SettingModal = ({ isOpen, onClose }) => {
  const [selectedOption, setSelectedOption] = useState("daily");
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  // Memoized option values to prevent unnecessary re-renders
  const optionValues = useMemo(
    () => ({
      daily: 1,
      weekly: 2,
      monthly: 3,
    }),
    []
  );

  useEffect(() => {
    if (isOpen) {
      const token = localStorage.getItem("token");
  
      fetch("http://localhost:5000/api/monthly-summary/select-option", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add token here
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.data?.id) {
            
            const selectedKey = Object.keys(optionValues).find(
              (key) => optionValues[key] === data.data.id
            );
            if (selectedKey) {
              setSelectedOption(selectedKey);
            }
          }
        })
        .catch((error) => console.error("Error fetching option:", error));
    }
  }, [isOpen, optionValues]);

  const handleSave = async () => {
    const selectedValue = optionValues[selectedOption];
    const token = localStorage.getItem("token");
    setIsSaving(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/monthly-summary/save-option",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ id: selectedValue }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save option");
      }

      console.log("Saved successfully", await response.json());
      console.log("Navigating to /dashboard...");
      navigate("/dashboard", { replace: true });
      navigate("/dashboard", { replace: true });
      setTimeout(() => onClose(), 100);
      //window.location.reload();
     
      
    } catch (error) {
      console.error("Error saving option:", error);
      alert("Failed to save selection. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-md z-[9999]">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="relative w-full max-w-4xl bg-gray-800/40 backdrop-blur-xl border border-gray-600/30 rounded-2xl shadow-2xl"
      >
        {/* Header */}
        <div className="flex justify-between items-center bg-gray-900 text-white p-4 rounded-t-2xl">
          <h2 className="text-lg font-semibold">⚙ Settings</h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-2 transition"
          >
            ✖
          </button>
        </div>

        {/* Tickets Overview Section */}
        <div className="p-6 bg-gray-800 text-white">
          <h3 className="text-lg font-medium mb-4">🎟 Tickets Overview</h3>
          <div className="grid grid-cols-3 gap-4">
            {Object.keys(optionValues).map((option) => (
              <label key={option} className="cursor-pointer text-center">
                <input
                  type="radio"
                  name="tickets"
                  value={option}
                  checked={selectedOption === option}
                  onChange={() => setSelectedOption(option)}
                  className="hidden"
                />
                <span
                  className={`block w-full py-3 rounded-lg transition ${
                    selectedOption === option
                      ? "bg-green-600 text-white"
                      : "bg-gray-700/40 hover:bg-gray-600/50"
                  }`}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end bg-gray-900 text-white p-4 rounded-b-2xl">
          <button
            onClick={handleSave}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition disabled:opacity-50"
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default SettingModal;
