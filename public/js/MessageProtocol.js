/**
 * isMessageFormatted
 */
function isMessageFormatted(message) {
  const sampleMessage = new messageProtocol();
  for (const key in sampleMessage) {
    if (!message.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
}
