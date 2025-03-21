const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/hydrationDB")
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Define User Schema
const userSchema = new mongoose.Schema({
  name: String,
  age: Number,
  heartRate: Number,
  sweatRate: Number,
  bodyTemperature: Number,
  email: String,
  hydrationLevel: { type: Number, default: 100 },
  dailyIntake: Number,
  timestamp: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

// Fetch Hydration Details
app.get("/api/hydration", async (req, res) => {
  const { name } = req.query;
  if (!name) return res.status(400).json({ error: "Name is required" });

  const user = await User.findOne({ name }).sort({ timestamp: -1 });
  if (user) {
    res.json(user);
  } else {
    res.json({ hydrationLevel: 100 });
  }
});

// Save User & Calculate Hydration Level
app.post("/api/user", async (req, res) => {
  const { name, age, heartRate, sweatRate, bodyTemperature, email } = req.body;
  if (!name || !age || !heartRate || !sweatRate || !bodyTemperature || !email) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const environmentalFactor = await getWeatherFactor();
    const dailyIntake = calculateDailyIntake(sweatRate, environmentalFactor);
    const hydrationLevel = calculateHydrationLevel(heartRate, sweatRate, bodyTemperature);

    const newUser = new User({
      name, age, heartRate, sweatRate, bodyTemperature, email, hydrationLevel, dailyIntake
    });

    await newUser.save();

    if (hydrationLevel < 50) {
      sendEmailAlert(email, name, hydrationLevel);
    }

    res.json({ message: "User saved successfully", hydrationLevel, dailyIntake });
  } catch (error) {
    console.error("Error calculating hydration level:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get Environmental Factor from Weather API
async function getWeatherFactor() {
  try {
    const response = await axios.get(`http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=New York`);
    const temperature = response.data.current.temp_c;
    return temperature > 30 ? 1.2 : 1.0; // Increase intake if hot
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return 1.0; // Default factor
  }
}

// Calculate Daily Intake Formula
function calculateDailyIntake(sweatRate, environmentalFactor) {
  const Baseline = 2.0; // Liters per day
  const HealthConditionAdjustment = 0.5; // Placeholder, can be user input
  return Baseline + (sweatRate * environmentalFactor) - HealthConditionAdjustment;
}

// Calculate Hydration Level
function calculateHydrationLevel(heartRate, sweatRate, bodyTemperature) {
  let hydration = 100 - ((heartRate / 200) * 20) - ((sweatRate / 10) * 20) - ((bodyTemperature - 37) * 10);
  return Math.max(hydration, 0);
}

// Send Email Alert
function sendEmailAlert(email, name, hydrationLevel) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

  let mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Hydration Alert - Immediate Attention Needed!",
    text: `Hello, 

    The hydration level of ${name} has dropped to ${hydrationLevel}. 
    Please ensure they drink water and take necessary precautions.

    Regards,
    Hydrasense Team`
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) console.error("Error sending email:", err);
    else console.log("Email sent:", info.response);
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
