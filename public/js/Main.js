import DebuggerConsole from "./utils/Debugger.js";
import ErrorCodes from "./utils/ErrorCodes.js";
import CarouselDisplay from "./media/CarouselDisplay.js";
import AssetManager from "./media/AssetManager.js";
import MediaPlayer from "./media/MediaPlayer.js";
import ChromecastChannel from "./communication/ChromecastChannel.js";
// NOTE: Can be used to check if the cast message on the message Interceptor was sent correctly or there was an error in formatting
import MessageProtocol from "./communication/MessageProtocol.js";
import CarouselDisplay from "./media/CarouselDisplay.js";
import IdleEndReason from "./utils/enums/EventEnums.js";

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

// WARN: For now it loads all media if the request comes with the url of the video eg. *.mp4
playerManager.setMessageInterceptor(cast.framework.messages.MessageType.LOAD, async (request) => {

    carousel.stopCarousel();

    // NOTE: For Development only
    console.log("Before modifying the request", JSON.stringify(request, null, 4));
    debuggerConsole.sendLog("warn", request);

    const { media } = request;
    const mediaInfo = mediaPlayer.playMedia(media);
    request.media = mediaInfo;

    // NOTE: For Development only
    console.log("After modifying the request", JSON.stringify(request, null, 4));

    return request;

});

// Detects when the player is in iddle
playerManager.addEventListener(cast.framework.events.EventType.MEDIA_FINISHED, (event) => {

    // TODO: Maybe use the MessageProtocol to check the message protocol
    // Maybe aswell sanitize or check for possible security problems ????

    // WARN: This might change depending on what the sender sends
    // if (event.type !== cast.framework.messages.PlayerState.IDLE) {
    //     return;
    // }

    // Check if the player is idle because the video ended, was stopped, or failed to load
    if (Object.values(IdleEndReason).find((e) => e === event.endedReason)) {

        // TODO: check for no items in the queue or any other conditions

        // Hide the cast-media-player ui
        mediaPlayer.hidePlayer();

        // Restart the carousel
        carousel.restartCarousel();
    }
})

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
