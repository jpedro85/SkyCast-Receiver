class DebuggerConsole {

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
        // Keep a reference to the new instance
        DebuggerConsole.instance = this;

        // Explicitly return the instance
        return this;
    }

    enableDebugOverlay(debugLogs = false) {
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
     * Function responsible for sending the Debugger logs.
     * @param {string} type the type of message you want to send being the same as the values in DebugMessagesEnum
     * @param {any[]} message The message that is going to be sent
     */
    sendLog(type, ...message) {
        if (type == this.DebugMessagesEnum.DEBUG) {
            this.console.debug(this, message);
        } else if (type == this.DebugMessagesEnum.INFO) {
            this.console.info(this.tag, message);
        } else if (type == this.DebugMessagesEnum.ERROR) {
            this.console.error(this.tag, message);
        } else if (type == this.DebugMessagesEnum.WARN) {
            this.console.warn(this.tag, message);
        } else {
            this.console.info(this.tag, message); // Default to info if type is not recognized
        }
    }
}

export default DebuggerConsole;