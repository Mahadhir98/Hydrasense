import { fetchRealTimeAnswer } from "./apiHelper";

class ActionProvider {
  constructor(createChatBotMessage, setStateFunc) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
  }

  handleWaterReminder = () => {
    const message = this.createChatBotMessage("💧 Remember to drink water regularly!");
    this.setState((prev) => ({ ...prev, messages: [...prev.messages, message] }));
  };

  handleGreeting = () => {
    const message = this.createChatBotMessage("👋 Hello! I'm Hydrasense Bot — here to help you stay hydrated.");
    this.setState((prev) => ({ ...prev, messages: [...prev.messages, message] }));
  };

  handleUnknown = () => {
    const message = this.createChatBotMessage("❓ I'm not sure how to respond. Try asking about hydration!");
    this.setState((prev) => ({ ...prev, messages: [...prev.messages, message] }));
  };

  handleMessage = async (userInput) => {
    // Add a temporary "Typing..." message
    const loadingMessage = this.createChatBotMessage("💬 Typing...");
    this.setState((prev) => ({
      ...prev,
      messages: [...prev.messages, loadingMessage],
    }));
  
    try {
      const reply = await fetchRealTimeAnswer(userInput);
  
      // Simulate typing delay (optional: 1s)
      setTimeout(() => {
        const botMessage = this.createChatBotMessage(reply);
  
        this.setState((prev) => {
          // Remove the "Typing..." message and add the actual reply
          const filteredMessages = prev.messages.filter(
            (msg) => msg.message !== "💬 Typing..."
          );
          return {
            ...prev,
            messages: [...filteredMessages, botMessage],
          };
        });
      }, 1000); // ⏳ 1 second delay
    } catch (error) {
      const errorMsg = this.createChatBotMessage("❌ Something went wrong.");
      this.setState((prev) => ({
        ...prev,
        messages: [...prev.messages, errorMsg],
      }));
    }
  };
}

export default ActionProvider;
