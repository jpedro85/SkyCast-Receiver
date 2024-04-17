import IdleEndReason from "./utils/enums/IdleEndReason.js";
import EventType from "./utils/enums/EventTypes.js";
import ErrorCodes from "./utils/enums/ErrorCodes.js";
import DebuggerConsole from "../utils/Debugger.js";
import MediaPlayer from "../media/playback/MediaPlayer.js";

class PlayerManager {

    constructor(carousel) {
        this.carousel = carousel;
        this.context = cast.framework.CastReceiverContext.getInstance();
        this.playerManager = this.context.getPlayerManager();
        this.debuggerConsole = new DebuggerConsole();
        this.mediaPlayer = new MediaPlayer();
    }

    logInfo(message, data) {
        console.log(message + ":", JSON.stringify(data, null, 4));
        this.debuggerConsole.sendLog("info", message + ": " + JSON.stringify(data));
    }

    logError(message) {
        console.error(message);
        this.debuggerConsole.sendLog("error", message);
    }

    initPlayerManager() {
        this.playerManager.setMessageInterceptor(cast.framework.messages.MessageType.LOAD, async (request) => {

            this.carousel.stopCarousel();

            // NOTE: For Development only
            console.log("Before modifying the request", JSON.stringify(request, null, 4));
            this.debuggerConsole.sendLog("info", request);

            const { media } = request;
            const mediaInfo = this.mediaPlayer.playMedia(media);
            request.media = mediaInfo;

            // NOTE: For Development only
            console.log("After modifying the request", JSON.stringify(request, null, 4));
            this.debuggerConsole.sendLog("info", request);

            return request;

        });

        Object.keys(EventType).forEach(event => {
            this.playerManager.addEventListener(event, (e) => this.handleEvent(e, EventType[event]));
        });

    }

    handleEvent(event, message) {
        const types = {
            MEDIA_FINISHED: cast.framework.events.EventType.MEDIA_FINISHED,
            ERROR: cast.framework.events.EventType.ERROR,
            MEDIA_STATUS: cast.framework.events.EventType.MEDIA_STATUS,
        }
        switch (event.type) {
            case types.MEDIA_FINISHED:
                if (Object.values(IdleEndReason).includes(event.endedReason)) {
                    this.mediaPlayer.hidePlayer();
                    this.carousel.startCarousel();
                }
                break;
            case types.ERROR:
                const error = Object.values(ErrorCodes).find((e) => e.code === event.detailedErrorCode);
                const errorMessage = error ? `Error ${error.code}: ${error.message}` : `Unknown Error Code - ${event.detailedErrorCode}`;
                this.logError(errorMessage);
                if (!this.carousel.isPlaying()) {
                    this.mediaPlayer.mediaPlayer.classList.toggle("hidden");
                    this.carousel.startCarousel();
                }
                break;
            case types.MEDIA_STATUS:
                console.log(message, event);
                this.debuggerConsole.sendLog("info", message + ": " + JSON.stringify(event));
                break;
            default:
                this.logInfo(message, event);
                break;
        }
    }

    startContext() {
        this.context.start({
            // NOTE: Development only
            disableIdleTimeout: true,
        });
    }
}

export default PlayerManager;
