const context = cast.framework.CastReceiverContext.getInstance();
const playerManager = context.getPlayerManager();

const debuggerConsole = cast.debug.CastDebugLogger.getInstance();
const logTag = "DebuggerConsole.LOG";

enableDebugOverlay();
sendLog("warn", "Hello World");

const NAMESPACE = "urn:x-cast:com.skycast.chromecast.communication";
// let communicationConstants = {};

// Set verbosity level for Core events and custom tags.
// castDebugLogger.loggerLevelByEvents = {
//   "cast.framework.events.category.CORE": cast.framework.LoggerLevel.INFO,
//   "cast.framework.events.EventType.MEDIA_STATUS": cast.framework.LoggerLevel.DEBUG,
// };

// castDebugLogger.loggerLevelByTags = {
//   LOG_TAG: cast.framework.LoggerLevel.DEBUG,
// };

sendLog("warn", "Test");

context.start();
