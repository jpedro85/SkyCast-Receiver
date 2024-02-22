// interface MesssageStructure {
//     type: string,
//     data: string,
// }

export class MessageProtocol {
    private type: string;
    private data: string;

    constructor(type: string, data: string) {
        this.type = type;
        this.data = data;
    }

    // Get the formatted message
    public getMessage(): { type: string; data: string } {
        return { type: this.type, data: this.data };
    }

    /**
     * isMessageFormatted
     */
    public static isMessageFormatted(message: unknown) {
        const sampleMessage = new MessageProtocol("", "");
        for (const key in sampleMessage) {
            if (!Object.hasOwnProperty.call(message, key)) {
                return false;
            }
        }
        return true
    }
}