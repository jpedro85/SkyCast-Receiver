import DebuggerConsole from "../utils/Debugger.js";
import MessageProtocol from "./MessageProtocol.js";

/**
 * This class provides functionality to send and receive messages to and from a Chromecast device using a specified namespace.
 * It utilizes the Cast framework and has integrated debugging capabilities.
 *
 * @example
 *
 * // Example of creating a ChromecastChannel instance
 * const NAMESPACE = 'urn:x-cast:com.example.custom';
 * const chromecastChannel = new ChromecastChannel(NAMESPACE);
 *
 * @example
 * // Example of sending a message using ChromecastChannel
 * const messageData = { type: 'greeting', data: 'Hello Chromecast!' };
 *
 * if (MessageProtocol.isMessageFormatted(messageData)) {
 *      chromecastChannel.sendMessage(messageData);
 * } else {
 *      console.error('Message data is not properly formatted.');
 * }
 *
 * @example
 * // Example of defining a dispatcher and handling a message
 * const dispatcher = {
 *      communicationConstants: {  "Communication constants" },
 *      callbacks: [  "Array of callback functions to handle messages" ]
 * };
 *
 * // Assuming message received from a sender
 * const message = { "Message received from a sender"  };
 * chromecastChannel.onMessage(dispatcher, message);
 */
class ChromecastChannel {
    /**
     * Represents a dispatcher with communication constants and callbacks.
     * @typedef {Object} Dispatcher
     * @property {object} communicationConstants - The constants used for communication.
     * @property {Function[]} callbacks - An array of callback functions.
     */
    /**
     * Creates an instance of ChromecastChannel, initializing communication with a Chromecast device.
     * This constructor sets up the necessary properties for the channel, including a unique namespace for messaging,
     * a dispatcher for handling incoming and outgoing messages, and initializes the Cast receiver context for communication.
     *
     * @param {string} namespace - A unique identifier for the messaging channel. This namespace is used to distinguish
     *                             messages intended for this receiver application from those intended for others.
     * @param {Dispatcher} dispatcher - An object that includes communication constants and callback functions. The
     *                                  communicationConstants are used to define various message types or other constants
     *                                  needed for message handling. The callbacks array contains functions that are
     *                                  executed in response to specific messages or events.
     */
    constructor(namespace, dispatcher) {
        // Assign namespace and extract communicationConstants and callbacks from dispatcher
        this.namespace = namespace;
        const { communicationConstants, callbacks } = dispatcher;
        this.communicationConstants = communicationConstants;
        this.callbacks = callbacks;

        // Initialize the CastReceiverContext and DebuggerConsole instances
        this.context = cast.framework.CastReceiverContext.getInstance();
        this.debugger = new DebuggerConsole();

        // Ensure the onMessage method correctly references this class instance
        this.onMessage = this.onMessage.bind(this);
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
     * Handles messages received by the dispatcher, logging the received message and performing
     * necessary actions based on the message content.
     *
     * @param {MessageProtocol} message - The message received from the sender, expected to conform
     *                                    to a predefined protocol (e.g., JSON object, specific command
     *                                    structure). The structure of `MessageProtocol` should be
     *                                    documented separately to define the expected message format
     *                                    and contents.
     */
    onMessage(message) {
        const { data } = message;
        const jsonText = this.printMessage(data);
        console.log(jsonText);
        this.debugger.sendLog("warn", "Message Received was:\n" + jsonText);
        // TODO implement the actions for the the message (messageHandler)
    }

    printMessage(data) {
        let jsonText = "Message Received: {\n";
        for (let key in data) {
            jsonText += '\t "' + key + '" : ' + data[key] + ",\n";
        }
        jsonText += "}";

        return jsonText;
    }
}

export default ChromecastChannel;