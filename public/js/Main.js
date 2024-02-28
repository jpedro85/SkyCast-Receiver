import DebuggerConsole from "./Debugger.js";
import ErrorCodes from "./ErrorCodes.js";
import ChromecastChannel from "./communication/ChromecastChannel.communication.js";

const context = cast.framework.CastReceiverContext.getInstance();
// The playerManager is what controls the player
const playerManager = context.getPlayerManager();

const NAMESPACE = "urn:x-cast:com.skycast.chromecast.communication";
let communicationConstants = {};

// Initializing the debugger
const debuggerConsole = new DebuggerConsole();
debuggerConsole.enableDebugOverlay(true);

// Custom Message Handler
const communicationChannel = new ChromecastChannel(NAMESPACE, { communicationConstants, callbacks: debuggerConsole.sendLog });
context.addCustomMessageListener(NAMESPACE, communicationChannel.onMessage);

// Report Errors that can occur in readable text
playerManager.addEventListener(cast.framework.events.EventType.ERROR, (event) => {
    const error = Object.values(ErrorCodes).find((e) => e.code === event.detailedErrorCode);
    const errorMessage = error ? `Error ${error.code}: ${error.message}` : `Unknown Error Code - ${event.detailedErrorCode}`;
    debuggerConsole.sendLog("error", errorMessage);
});

context.start({
    disableIdleTimeout: true,
});
