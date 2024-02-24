import DebuggerConsole from "../Debugger.js";
import MessageProtocol from "../MessageProtocol.js";

/**
 * This class provides the functionality to send and receive messages to and from a Chromecast device using a specified namespace.
 * It utilizes the Cast framework and has integrated debugging capabilities.
 */
/**
 * This class provides functionality to send and receive messages to and from a Chromecast device using a specified namespace.
 * It utilizes the Cast framework and has integrated debugging capabilities.
 *
 * @example
 * ```
 *      // Example of creating a ChromecastChannel instance
 *      const namespace = 'urn:x-cast:com.example.custom';
 *      const chromecastChannel = new ChromecastChannel(namespace);
 * ```
 * @example
 * ```
 *      // Example of sending a message using ChromecastChannel
 *      const messageData = { type: 'greeting', data: 'Hello Chromecast!' };
 *      if (MessageProtocol.isMessageFormatted(messageData)) {
 *        chromecastChannel.sendMessage(messageData);
 *      } else {
 *        console.error('Message data is not properly formatted.');
 *      }
 * ```
 * @example
 * ```
 *      // Example of defining a dispatcher and handling a message
 *      const dispatcher = {
 *        communicationConstants: {  "Communication constants" },
 *        callbacks: [  "Array of callback functions to handle messages" ]
 *      };
 *      // Assuming message received from a sender
 *      const message = { "Message received from a sender"  };
 *      chromecastChannel.onMessage(dispatcher, message);
 * ```
 */
export default class ChromecastChannel {
    constructor(namespace) {
        this.namespace = namespace;
        this.context = cast.framework.CastReceiverContext.getInstance();
        this.debugger = new DebuggerConsole();
    }

    /**
     * Sends a message to all connected senders (e.g., a smartphone app).
     * It first checks if the message is properly formatted according to the MessageProtocol.
     * If not, logs an error and sends a formatted error message to the debugger console.
     *
     * @param {Object} data - The data to be sent. Should be formatted as per MessageProtocol.
     */
    sendMessage(data) {
        if (!MessageProtocol.isMessageFormatted(data)) {
            console.log("object was not formatted correctly" + data);
            this.debugger.sendLog("error", "object was not formatted correctly" + data);
            return;
        }

        this.context.getSenders().forEach((sender) => context.sendCustomMessage(namespace, sender.id, data));
    }

    /**
     * Represents a dispatcher with communication constants and callbacks.
     * @typedef {Object} Dispatcher
     * @property {object} communicationConstants - The constants used for communication.
     * @property {Function[]} callbacks - An array of callback functions.
     */
    /**
     * Handles messages received by the dispatcher
     * @param {Dispatcher} dispatcher The dispatcher instance handling the message
     * @param {MessageProtocol} message
     */
    onMessage(dispatcher, message) {
        const { communicationConstants, callbacks } = dispatcher;
        console.log(message);
        this.debugger.sendLog("info", "Message Received was:\n" + message);
        // TODO implement the actions for the the message (messageHandler)
    }
}
