import IdleEndReason from "./enums/EventEnums.js";
import ErrorCodes from "./enums/ErrorCodes.js";
import DebuggerConsole from "./utils/Debugger.js";
import MediaPlayer from "./media/MediaPlayer.js";
import { PlayerData } from "chromecast-caf-receiver/cast.framework.ui.js";

class PlayerManager {

    constructor(carousel) {
        this.carousel = carousel;
        this.context = cast.framework.CastReceiverContext.getInstance();
        this.playerManager = this.context.getPlayerManager();
        this.debuggerConsole = new DebuggerConsole();
    }

    initPlayerManager() {
        // The playerManager is what controls the player
        const mediaPlayer = new MediaPlayer();

        this.playerManager.setMessageInterceptor(cast.framework.messages.MessageType.LOAD, async (request) => {

            this.carousel.stopCarousel();

            // NOTE: For Development only
            console.log("Before modifying the request", JSON.stringify(request, null, 4));

            const { media } = request;
            const mediaInfo = mediaPlayer.playMedia(media);
            request.media = mediaInfo;

            // NOTE: For Development only
            console.log("After modifying the request", JSON.stringify(request, null, 4));

            return request;

        });

        // Detects when the player is in iddle
        this.playerManager.addEventListener(cast.framework.events.EventType.MEDIA_FINISHED, (event) => {

            // Check if the player is idle because the video ended, was stopped, or failed to load
            if (Object.values(IdleEndReason).find((e) => e === event.endedReason)) {

                // Hide the cast-media-player ui
                mediaPlayer.hidePlayer();

                // Restart the carousel
                this.carousel.startCarousel();
            }
        })

        // Report Errors that can occur in readable text
        // Also in case of error can execute custom code
        this.playerManager.addEventListener(cast.framework.events.EventType.ERROR, (event) => {
            const error = Object.values(ErrorCodes).find((e) => e.code === event.detailedErrorCode);
            const errorMessage = error ? `Error ${error.code}: ${error.message}` : `Unknown Error Code - ${event.detailedErrorCode}`;
            console.error(errorMessage);
            this.debuggerConsole.sendLog("error", errorMessage);

            // For the event that it was playing a video or doign something else and the player crashes or has an error
            // it will restart the carousel
            if (!this.carousel.isPlaying()) {
                mediaPlayer.mediaPlayer.classList.toggle("hidden");
                this.carousel.startCarousel();
            }
        });
    }

    startContext() {
        this.context.start({
            // NOTE: Development only
            disableIdleTimeout: true,
        });
    }
}
export default PlayerManager;
