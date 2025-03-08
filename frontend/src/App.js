import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [hydrationLevel, setHydrationLevel] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    fetchHydrationData();
    const interval = setInterval(fetchHydrationData, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchHydrationData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/hydration");
      setHydrationLevel(response.data.level);
      checkHydrationLevel(response.data.level);
    } catch (error) {
      console.error("Error fetching hydration data", error);
    }
  };

  const checkHydrationLevel = (level) => {
    if (level < 30) {
      setAlertMessage("⚠️ Critical Hydration Level! Drink Water Now!");
    } else {
      setAlertMessage("✅ Hydration Level Normal");
    }
  };

  return (
    <div className="container">
      <h1>💧 Welcome to Hydration Monitor</h1>
      <div className="status-box">
        <h2>Hydration Level: {hydrationLevel ? hydrationLevel + "%" : "Loading..."}</h2>
        <h3 className={hydrationLevel < 30 ? "alert-critical" : "alert-normal"}>{alertMessage}</h3>
      </div>
    </div>
  );
};

export default App;
