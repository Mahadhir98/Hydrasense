import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import watchImage from "./assets/image.png";
import ChatbotComponent from "./ChatbotComponent";
import UserList from "./UserList";

function MainFormPage() {
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
  const [alertReady, setAlertReady] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  const isOutsideNormalRange = (user) => {
    const age = parseInt(user.age);
    const heart = parseFloat(user.heartRate);
    const sweat = parseFloat(user.sweatRate);
    const temp = parseFloat(user.bodyTemperature);

    if (age > 65) {
      return heart < 60 || heart > 100 || sweat < 0.3 || sweat > 1.0 || temp < 36.0 || temp > 36.8;
    } else {
      return heart < 60 || heart > 100 || sweat < 0.1 || sweat > 0.2 || temp < 36.1 || temp > 37.2;
    }
  };

  const fetchHydrationLevel = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/hydration?name=${user.name}`);
      if (response.data) {
        setHydrationData(response.data);
        if (alertReady) setShowAlert(isOutsideNormalRange(user));
      }
    } catch (error) {
      console.error("Error fetching hydration level:", error);
    }
  }, [user, alertReady]);

  useEffect(() => {
    if (user.name && alertReady) fetchHydrationLevel();
  }, [user.name, fetchHydrationLevel, alertReady]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/user", user);
      setAlertReady(true);
      setShowModal(true);
      fetchHydrationLevel();
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  return (
    <div className="container">
      {/* LEFT: Form */}
      <div className="left-section">
        <h1>Hydrasense</h1>

        <form onSubmit={handleSubmit} className="user-form">
          {["name", "age", "heartRate", "sweatRate", "bodyTemperature", "email"].map((field) => (
            <div key={field}>
              <label>{field === "bodyTemperature" ? "Body Temperature (°C)" : field.charAt(0).toUpperCase() + field.slice(1) + (field === "sweatRate" ? " (L/h)" : "")}:</label>
              <input
                type={["age", "heartRate", "sweatRate", "bodyTemperature"].includes(field) ? "number" : field === "email" ? "email" : "text"}
                value={user[field]}
                onChange={(e) => setUser({ ...user, [field]: e.target.value })}
                required
              />
              {field === "heartRate" && <span className="ref-note">60–100 bpm</span>}
              {field === "sweatRate" && <span className="ref-note">0.1–0.2 L/h (Normal), 0.3–1.0 (65+)</span>}
              {field === "bodyTemperature" && <span className="ref-note">36.1–37.2°C (Normal), 36.0–36.8°C (65+)</span>}
            </div>
          ))}
          <div className="form-buttons">
            <button type="submit" className="btn-save">💾 Submit</button>
            <button type="button" className="btn-view" onClick={() => navigate("/users")}>🔍 View Saved Users</button>
          </div>
        </form>

        {hydrationData && showModal && (
          <div className="modal-above-form">
            <div className="modal-box">
              <button className="modal-close" onClick={() => setShowModal(false)}>✖</button>
              <h2>{hydrationData.name}'s Hydration Details</h2>
              <p>💙 Heart Rate: {hydrationData.heartRate ?? "N/A"} BPM</p>
              <p>💦 Sweat Rate: {hydrationData.sweatRate ?? "N/A"} L/h</p>
              <p>🌡 Body Temperature: {hydrationData.bodyTemperature ?? "N/A"}°C</p>
              <p>📊 Hydration Level: {hydrationData?.hydrationLevel?.toFixed(1) ?? "N/A"}</p>
              <p>💧 Daily Intake: {hydrationData?.dailyIntake?.toFixed(2) ?? "N/A"} L</p>
              <div className="modal-footer">
                <button className="btn-save" onClick={handleSubmit}>💾 Save to Database</button>
                <button className="btn-close" onClick={() => setShowModal(false)}>❌ Close</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MIDDLE: Watch */}
      <div className="middle-section">
        <div className="watch-container">
          <img src={watchImage} alt="Smartwatch Display" className="watch-image" />
          {showAlert && <div className="watch-alert-centered">⚠️ Drink Water!</div>}
        </div>
      </div>

      {/* RIGHT: Chatbot */}
      <div className="right-section">
        <div className="chatbot-container">
          <ChatbotComponent />
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainFormPage />} />
      <Route path="/users" element={<CenteredUserList />} />
    </Routes>
  );
}

function CenteredUserList() {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      padding: "20px"
    }}>
      <UserList onBack={() => window.history.back()} />
    </div>
  );
}

export default App;
