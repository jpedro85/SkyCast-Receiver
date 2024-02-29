/**
 * Represents a protocol for message handling.
 * It's used for creating and validating message objects based on a predefined protocol.
 */
class MessageProtocol {
    /**
     * @param {string} [type=""] - The type of the message. This parameter specifies the message's category or purpose.
     * @param {string} [data=""] - The data contained in the message. This is the content or information the message carries.
     */
    constructor(type = "", data = "") {
        this.type = type;
        this.data = data;
    }

    /**
     * Checks if a given message object is formatted correctly according to the MessageProtocol.
     * This static method ensures that the message object includes all necessary properties defined by the protocol.
     * @static
     * @param {Object} message - The message object to be validated.
     * @returns {boolean} - Returns true if the message object contains all required properties, false otherwise.
     */
    static isMessageFormatted(message) {
        const sampleMessage = new MessageProtocol();

        for (const key in sampleMessage) {
            if (!message.hasOwnProperty(key)) {
                return false;
            }
        }

        return true;
    }
}

export default MessageProtocol;