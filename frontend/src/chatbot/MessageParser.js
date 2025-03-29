class MessageParser {
  constructor(actionProvider) {
    this.actionProvider = actionProvider;
  }

  parse(message) {
    const lower = message.toLowerCase();
    if (lower.includes("water") || lower.includes("drink")) {
      this.actionProvider.handleWaterReminder();
    } else {
      this.actionProvider.handleUnknown();
    }
  }
}

export default MessageParser;
