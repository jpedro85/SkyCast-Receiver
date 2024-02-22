import { ChromecastChannel } from "./communication/ChromecastChannel.communication";
import { DebuggerConsole, LoggerEventTypesEnum, DebugMessagesType, DebugMessagesEnum } from "./Debugger";
import { MediaPlayer } from "./MediaPlayer";

const context = cast.framework.CastReceiverContext.getInstance();
// const context = cast.framework.CastReceiverContext.getInstance();

// window._setTimeout = window.setTimeout;
// window.setTimeout = () => { };

// function onConnectionEstablished() {
//     main();
// }

// window.addEventListener("DOMContentLoaded", main);

const NAMESPACE: string = "urn:x-cast:com.skycast.chromecast.communication";
let communicationConstants = {};

const debuggerConsole = DebuggerConsole.getInstance();
debuggerConsole.enableDebugOverlay();
debuggerConsole.setLoggerLevelEvents({
    type: LoggerEventTypesEnum.EventType,
    data: {
        "MEDIA_STATUS": cast.framework.LoggerLevel.DEBUG,
    }
})
debuggerConsole.setLoggerLevelEvents({
    type: LoggerEventTypesEnum.category,
    data: {
        "CORE": cast.framework.LoggerLevel.INFO,
    }
})

const logType: DebugMessagesType = DebugMessagesEnum.WARN;
debuggerConsole.sendLog(logType, "Hello World");

// const communicationChannel = new ChromecastChannel(NAMESPACE);
// const mediaPlayer = new MediaPlayer();


// function main() {
//     context.start();
// }

context.start();