/**
 * isMessageFormatted
 */

export default class MessageProtocol {
    constructor(type = "", data = "") {
        this.type = type;
        this.data = data;
    }

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
