/**
 * A utility class for managing debug logging in a Google Cast application. It encapsulates the Google Cast debug logger,
 * allowing for easy control over log messages and debug overlay.
 *
 * @example
 * // Initialize (or get existing instance of) DebuggerConsole
 * const debuggerConsole = new DebuggerConsole();
 *
 * // Enable debug overlay with debug logs visible
 * debuggerConsole.enableDebugOverlay(true);
 *
 * // Send an informational log message
 * debuggerConsole.sendLog(debuggerConsole.DebugMessagesEnum.INFO, "This is an info message");
 *
 */
class DebuggerConsole {
    /**
     * Replacing the getInstance() method due to the getInstance method not giving correct autocomplete
     * due to not having a type return.
     */
    constructor() {

        if (DebuggerConsole.instance instanceof DebuggerConsole) {
            return DebuggerConsole.instance;
        }

        // Initialize your class instance here
        this.DebugMessagesEnum = {
            INFO: "info",
            DEBUG: "debug",
            ERROR: "error",
            WARN: "warn",
        };
        this.console = cast.debug.CastDebugLogger.getInstance();
        this.tag = "DebuggerConsole.LOG";
        this.errorTag = "ErrorTag.LOG"
        // Keep a reference to the new instance
        DebuggerConsole.instance = this;

        // Explicitly return the instance
        return this;
    }

    /**
     * Enables the debug overlay and sets the verbosity level for Core events and custom tags.
     * It also allows for enabling or disabling debug logs in the overlay.
     * @param {boolean} [debugLogs=false] - Indicates whether debug logs should be shown in the debug overlay.
     */
    enableDebugOverlay(debugLogs = false) {
        if (typeof debugLogs !== "boolean") {
            throw new Error("Arguments must be boolean.");
        }
        this.console.setEnabled(true);
        this.console.showDebugLogs(debugLogs);
        // Set verbosity level for Core events and custom tags.
        this.console.loggerLevelByEvents = {
            "cast.framework.events.category.CORE": cast.framework.LoggerLevel.INFO,
            "cast.framework.events.EventType.MEDIA_STATUS": cast.framework.LoggerLevel.DEBUG,
        };

        this.console.loggerLevelByTags = {
            logTag: cast.framework.LoggerLevel.DEBUG,
        };
    }

    /**
     * Sends a log message to the Cast debug logger. The type of the log message must match one of the predefined types in `DebugMessagesEnum`.
     * @param {('info'|'debug'|'error'|'warn')} type - The type of message you want to send. Must be one of the following values: 'info', 'debug', 'error', 'warn'.
     * @param {...any} message - The message(s) that are going to be sent. Can be of any type.
     */
    sendLog(type, ...message) {
        if (type == this.DebugMessagesEnum.DEBUG) {
            this.console.debug(this, message);
        } else if (type == this.DebugMessagesEnum.INFO) {
            this.console.info(this.tag, message);
        } else if (type == this.DebugMessagesEnum.ERROR) {
            this.console.error(this.errorTag, message);
        } else if (type == this.DebugMessagesEnum.WARN) {
            this.console.warn(this.tag, message);
        } else {
            // Default to info if type is not recognized
            this.console.info(this.tag, message);
        }
    }
}

export default DebuggerConsole;
