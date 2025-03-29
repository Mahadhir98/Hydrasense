// chatbot/apiHelper.js
import axios from "axios";

export const fetchRealTimeAnswer = async (message) => {
  try {
    const res = await axios.post("http://localhost:5000/api/search", { query: message });
    return res.data.answer;
  } catch (error) {
    return "❌ Could not fetch an answer at the moment.";
  }
};
