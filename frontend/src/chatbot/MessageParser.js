class MessageParser {
  constructor(actionProvider) {
    this.actionProvider = actionProvider;
  }

  parse(message) {
    const lower = message.toLowerCase().trim();

    // Check if message is a **short greeting**
    const greetings = ["hello", "hi", "hey", "good morning","Thank you","Thanks", "good evening"];
    const hydrationKeywords = ["hydration", "water", "drink", "fluids", "sweat", "dehydration"];

    const isGreetingOnly = greetings.includes(lower); // must match exactly
    const isHydrationQuestion = hydrationKeywords.some((word) => lower.includes(word));

    if (isGreetingOnly) {
      this.actionProvider.handleGreeting();
    } else if (isHydrationQuestion) {
      this.actionProvider.handleMessage(message);
    } else {
      this.actionProvider.handleUnknown();
    }
  }
}

export default MessageParser;
