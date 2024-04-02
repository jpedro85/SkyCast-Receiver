import IdleEndReason from "./utils/enums/EventEnums.js";
import ErrorCodes from "./utils/enums/ErrorCodes.js"
import DebuggerConsole from "./utils/Debugger.js";
import MediaPlayer from "./media/MediaPlayer.js";

const context = cast.framework.CastReceiverContext.getInstance();
const playerManager = context.getPlayerManager();

const debuggerConsole = new DebuggerConsole();

export function initPlayerManager(carousel) {
    // The playerManager is what controls the player
    const mediaPlayer = new MediaPlayer();
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

        // Check if the player is idle because the video ended, was stopped, or failed to load
        if (Object.values(IdleEndReason).find((e) => e === event.endedReason)) {

            // Hide the cast-media-player ui
            mediaPlayer.hidePlayer();

            // Restart the carousel
            carousel.startCarousel();
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
            carousel.startCarousel();
        }
    });
}

export function startContext() {
    context.start({
        // NOTE: Development only
        disableIdleTimeout: true,
    });
}
