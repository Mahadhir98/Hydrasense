class ActionProvider {
  constructor(createChatBotMessage, setStateFunc) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
  }

  handleWaterReminder = () => {
    const message = this.createChatBotMessage("Yes, remember to drink water regularly to stay hydrated!");
    this.setState((prev) => ({ ...prev, messages: [...prev.messages, message] }));
  };

  handleUnknown = () => {
    const message = this.createChatBotMessage("I'm not sure how to respond. Try asking about hydration!");
    this.setState((prev) => ({ ...prev, messages: [...prev.messages, message] }));
  };
}

export default ActionProvider;
