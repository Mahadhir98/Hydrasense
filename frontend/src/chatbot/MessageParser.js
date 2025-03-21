class MessageParser {
    constructor(actionProvider) {
      this.actionProvider = actionProvider;
    }
  
    parse(message) {
      const lowerCaseMessage = message.toLowerCase();
  
      if (lowerCaseMessage.includes("hydration")) {
        this.actionProvider.handleHydrationInfo();
      } else if (lowerCaseMessage.includes("health")) {
        this.actionProvider.handleHealthTips();
      } else {
        this.actionProvider.handleUnknown();
      }
    }
  }
  
  export default MessageParser;
  