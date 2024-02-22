/* eslint-disable no-undef */

const DebugMessagesEnum = {
    INFO: "info",
    DEBUG: "debug",
    ERROR: "error",
    WARN: "warn",
};

function enableDebugOverlay(debugLogs = false) {
    debuggerConsole.setEnabled(true);
    debuggerConsole.showDebugLogs(debugLogs)
}

function sendLog(type, ...message) {
    switch (type) {
        case DebugMessagesEnum.DEBUG:
            debuggerConsole.debug(this.logTag, message);
            break;
        case DebugMessagesEnum.INFO:
            debuggerConsole.info(this.logTag, message);
            break;
        case DebugMessagesEnum.ERROR:
            debuggerConsole.error(this.logTag, message);
            break;
        case DebugMessagesEnum.WARN:
            debuggerConsole.warn(this.logTag, message);
            break;

        default:
            debuggerConsole.info(this.logTag, message);
            break;
    }
}
