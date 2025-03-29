import { createChatBotMessage } from "react-chatbot-kit";

const botName = "HydraBot";

const config = {
  botName: botName,
  initialMessages: [
    createChatBotMessage("👋 Hi, I am HydraBot. Welcome to HydraSense! Ask me anything about hydration."),
  ],
  customStyles: {
    botMessageBox: {
      backgroundColor: "#007bff",
    },
    chatButton: {
      backgroundColor: "#007bff",
    },
  },
};

export default config;
