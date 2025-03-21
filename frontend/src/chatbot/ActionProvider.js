class ActionProvider {
    constructor(createChatBotMessage, setStateFunc) {
      this.createChatBotMessage = createChatBotMessage;
      this.setState = setStateFunc;
    }
  
    handleHydrationInfo = () => {
      const message = this.createChatBotMessage("Drink at least 2L of water per day!");
      this.updateChatbotState(message);
    };
  
    handleHealthTips = () => {
      const message = this.createChatBotMessage("Exercise daily and eat a balanced diet.");
      this.updateChatbotState(message);
    };
  
    handleUnknown = () => {
      const message = this.createChatBotMessage("I can help with hydration and health tips!");
      this.updateChatbotState(message);
    };
  
    updateChatbotState(message) {
      this.setState((prev) => ({
        ...prev,
        messages: [...prev.messages, message],
      }));
    }
  }
  
  export default ActionProvider;
  