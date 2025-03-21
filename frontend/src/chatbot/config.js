import { createChatBotMessage } from "react-chatbot-kit";

const config = {
  botName: "HydraBot",
  initialMessages: [
    createChatBotMessage("Hello! How can I assist you with hydration and health?")
  ],
};

export default config;
