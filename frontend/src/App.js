import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import watchImage from "./assets/image.png";
import ChatbotComponent from "./ChatbotComponent";


function App() {
  const [user, setUser] = useState({
    name: "", 
    age: "", 
    heartRate: "", 
    sweatRate: "", 
    bodyTemperature: "", 
    email: ""
  });

  const [hydrationData, setHydrationData] = useState(null);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (user.name) fetchHydrationLevel();
  }, [user.name]);

  const fetchHydrationLevel = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/hydration?name=${user.name}`);
      if (response.data) {
        setHydrationData(response.data);
        setShowAlert(response.data.hydrationLevel < 50);
      }
    } catch (error) {
      console.error("Error fetching hydration level:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/user", user);
      fetchHydrationLevel();
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  return (
    <div className="container">
      <div className="left-section">
        <h1>Hydrasense</h1>

        <form onSubmit={handleSubmit} className="user-form">
          {["name", "age", "heartRate", "sweatRate", "bodyTemperature", "email"].map((field) => (
            <input 
              key={field} 
              type={field === "age" || field === "heartRate" || field === "sweatRate" || field === "bodyTemperature" ? "number" : "text"} 
              placeholder={`Enter ${field}`} 
              value={user[field] || ""} 
              onChange={(e) => setUser({ ...user, [field]: e.target.value })} 
              required 
            />
          ))}
          <button type="submit">Save User</button>
        </form>

        {hydrationData && (
          <div className="hydration-info">
            <h2>{hydrationData.name}'s Hydration Details</h2>
            <p>💙 Heart Rate: {hydrationData.heartRate ?? "N/A"} BPM</p>
            <p>💦 Sweat Rate: {hydrationData.sweatRate ?? "N/A"} L/h</p>
            <p>🌡 Body Temperature: {hydrationData.bodyTemperature ?? "N/A"}°C</p>        
            <p>🚰 Hydration Level: {hydrationData?.hydrationLevel !== undefined ? hydrationData.hydrationLevel.toFixed(1) : "N/A"}</p>
            <p>💧 Daily Intake: {hydrationData?.dailyIntake !== undefined ? hydrationData.dailyIntake.toFixed(2) : "N/A"} L</p>
            
            {showAlert && <p className="alert-text">⚠️ Time to Drink Water!</p>}
          </div>
        )}
      </div>

      <div className="right-section">
        <div className="watch-container">   
          <img src={watchImage} alt="Smartwatch Display" className="watch-image" />
          {showAlert && <div className="watch-alert">⚠️ Drink Water!</div>}
        </div>
      </div>
      <ChatbotComponent /> 
    </div>
  );
}

export default App;
 