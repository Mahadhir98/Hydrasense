const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

//mongodb+srv://mahadhirmohamed98:<db_password>@cluster0.yjyib.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/hydrationDB")
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.error("MongoDB Connection Error:", err));


const hydrationSchema = new mongoose.Schema({
  level: Number,
  timestamp: { type: Date, default: Date.now },
});

const Hydration = mongoose.model("Hydration", hydrationSchema);

app.get("/api/hydration", async (req, res) => {
  const latestData = await Hydration.findOne().sort({ timestamp: -1 });
  res.json(latestData || { level: 100 });
});

app.post("/api/hydration/update", async (req, res) => {
  const { level } = req.body;
  const newEntry = new Hydration({ level });
  await newEntry.save();
  res.json({ message: "Hydration Level Updated", level });
});



app.listen(5000, () => console.log("Server running on port 5000"));
