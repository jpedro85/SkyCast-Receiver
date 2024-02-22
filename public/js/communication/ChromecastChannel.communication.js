function messageProtocol(type="", data = "") {
    return { type, data }
}

/**
 * sendMessage
 */
function sendMessage(data) {
  if (!messageProtocol.isMessageFormatted(data)) {
    debuggerConsoler.sendLog(DebugMessagesEnum.INFO, "MyApp.LOG", "object was not formated correctly" + data);
    return;
  }

  context.getSenders().forEach((sender) => context.sendCustomMessage(namespace, sender.id, data));
}
