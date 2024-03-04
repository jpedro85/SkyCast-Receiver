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

// TODO: Pass this function to the MediaPlayer
// WARN: For now it loads all media if the request comes with the url of the video eg. *.mp4
// NOTE: Should return a modified request or a Promise that resolves with the modified request
playerManager.setMessageInterceptor(cast.framework.messages.MessageType.LOAD, async (request) => {

    // const { media } = request;
    // console.log("Before modifying the request", JSON.stringify(request, null, 4));
    //
    // // When it receives a LOAD request it will stop the carousel hide it
    // // And will start the cast-media-player with respective media
    // carousel.stopCarousel();
    // mediaPlayer.startPlayer();
    //
    // // Create a MediaInfo object
    // console.log(media.contentUrl)
    // const mediaInfo = new cast.framework.messages.MediaInformation();
    // mediaInfo.contentId = media.contentUrl;
    // mediaInfo.contentType = "video/mp4";
    // mediaInfo.streamType = cast.framework.messages.StreamType.BUFFERED;
    //
    // request.media = mediaInfo;
    //
    // console.log("After modifying the request", JSON.stringify(request, null, 4));
    //
    // return request;

    carousel.stopCarousel();

    console.log("Before modifying the request", JSON.stringify(request, null, 4));

    const {media} = request;
    const mediaInfo = mediaPlayer.playMedia(media);
    request.media = mediaInfo;

    console.log("After modifying the request", JSON.stringify(request, null, 4));

    return request;
});

// FIX: For some its saying its an invalid EventType
//
// Detects when the player is in iddle
// playerManager.addEventListener(cast.framework.events.EventType.PLAYER_STATE_CHANGED, (event) => {
//
//     if (event.playerState !== cast.framework.messages.PlayerState.IDLE) {
//         return;
//     }
//
//     // Check if the player is idle because the video ended, was stopped, or failed to load
//     if (event.idleReason === cast.framework.messages.IdleReason.FINISHED ||
//         event.idleReason === cast.framework.messages.IdleReason.CANCELLED ||
//         event.idleReason === cast.framework.messages.IdleReason.ERROR) {
//
//         // TODO: Check for no items in the queue or any other conditions
//
//         // Hide the cast-media-player UI
//         mediaPlayer.startPlayer();
//
//         // Restart the carousel
//         carousel.restartCarousel();
//     }
// })

// Report Errors that can occur in readable text
// Also in case of error can execute custom code
playerManager.addEventListener(cast.framework.events.EventType.ERROR, (event) => {
    const error = Object.values(ErrorCodes).find((e) => e.code === event.detailedErrorCode);
    const errorMessage = error ? `Error ${error.code}: ${error.message}` : `Unknown Error Code - ${event.detailedErrorCode}`;
    debuggerConsole.sendLog("error", errorMessage);

    // For the event that it was playing a video or doign something else and the player crashes or has an error
    // it will restart the carousel
    if (!carousel.isPlaying()) {
        mediaPlayer.mediaPlayer.classList.toggle("hidden");
        carousel.restartCarousel();
    }
});

context.start({
    // NOTE: Development only
    disableIdleTimeout: true,
});
