import DebuggerConsole from "./utils/Debugger.js";
import ErrorCodes from "./utils/ErrorCodes.js";
import CarouselDisplay from "./media/CarouselDisplay.js";
import AssetManager from "./media/AssetManager.js";
import MediaPlayer from "./media/MediaPlayer.js";
import ChromecastChannel from "./communication/ChromecastChannel.js";
import MessageProtocol from "./communication/MessageProtocol.js";

const context = cast.framework.CastReceiverContext.getInstance();
// The playerManager is what controls the player
const playerManager = context.getPlayerManager();
const mediaPlayer = new MediaPlayer();

const NAMESPACE = "urn:x-cast:com.skycast.chromecast.communication";
let communicationConstants = {};

// Initializing the debugger
const debuggerConsole = new DebuggerConsole();
debuggerConsole.enableDebugOverlay();

// Custom Message Handler
const communicationChannel = new ChromecastChannel(NAMESPACE, { communicationConstants, callbacks: debuggerConsole.sendLog });
context.addCustomMessageListener(NAMESPACE, communicationChannel.onMessage);

// Start the Image Carousel
const carousel = new CarouselDisplay("#container", 5000);
const assetManager = new AssetManager();
carousel.addObserver(assetManager);
carousel.setupCarousel("https://mobile.clients.peacocktv.com/bff/sections/v1?segment=all_premium_users&node_id=13dba516-9722-11ea-bbcc-234acf5d5a4e", {
    Host: "mobile.clients.peacocktv.com",
    "X-SkyOTT-Provider": "NBCU",
    "X-SkyOTT-Proposition": "NBCUOTT",
    "X-SkyOTT-Territory": "US",
    "X-SkyOTT-Language": "en",
    "X-SkyOTT-Device": "MOBILE",
    "X-SkyOTT-Platform": "IOS",
});

// TODO Implement the messageInterceptor for the chromecast
// ! There is a problem of how to initialize the cast media player before the request else it wont load correctly
// playerManager.setMessageInterceptor(cast.framework.messages.MessageType.LOAD, async (request) => {
//     // Create the media player
//     // mediaPlayer.createMediaPlayer();

//     // // console.log(JSON.stringify(media, null, 4));
//     // console.log(JSON.stringify(request, null, 4));

//     // const copy = request;

//     // // Pass the data or message to see if its a valid format
//     // if (!MessageProtocol.isMessageFormatted(copy)) {
//     //     mediaPlayer.destroyMediaPlayer();
//     // }

//     // // Play the media
//     // console.log(JSON.stringify(request, null, 4))
//     // mediaPlayer.playMedia(media, request);

//     // return request;
// });

// Report Errors that can occur in readable text
playerManager.addEventListener(cast.framework.events.EventType.ERROR, (event) => {
    const error = Object.values(ErrorCodes).find((e) => e.code === event.detailedErrorCode);
    const errorMessage = error ? `Error ${error.code}: ${error.message}` : `Unknown Error Code - ${event.detailedErrorCode}`;
    debuggerConsole.sendLog("error", errorMessage);
});

context.start({
    disableIdleTimeout: true,
});
