import IdleEndReason from "./utils/enums/IdleEndReason.js";
import EventType from "./utils/enums/EventTypes.js";
import ErrorCodes from "./utils/enums/ErrorCodes.js";
import DebuggerConsole from "../utils/Debugger.js";
import MediaPlayer from "../media/playback/MediaPlayer.js";

/**
 * Manages player interactions and states within a media casting environment.
 * This class handles the logic for integrating media playback with carousel
 * display control, error handling, and debugging output. It utilizes several
 * utilities to manage different aspects of media control, including handling
 * different types of player events and intercepting load requests to modify media requests.
 *
 * @example <caption>Usage Example:</caption>
 * // Assuming carousel is already initialized somewhere in your application
 * const playerManager = new PlayerManager(carousel);
 * playerManager.initPlayerManager();
 * playerManager.startContext();
 */
class PlayerManager {

    /*
    * Constructs a PlayerManager to manage media playback and interaction with a carousel display.
    * @param {CarouselDisplay} carousel - The CarouselDisplay instance to be controlled during media playback.
    */
    constructor(carousel) {
        this.carousel = carousel;
        this.context = cast.framework.CastReceiverContext.getInstance();
        this.playerManager = this.context.getPlayerManager();
        this.debuggerConsole = new DebuggerConsole();
        this.mediaPlayer = new MediaPlayer();
        this.isPlaying = false;
    }

    /**
    * Logs informational messages to both the console and a debugger console.
    * @param {string} message - The main message to log.
    * @param {Object} data - Additional data to include in the log.
    */
    logInfo(message, data) {
    }

    /**
     * Logs error messages to both the console and a debugger console.
     * @param {string} message - The error message to log.
     */
    logError(message) {
        console.error(message);
        this.debuggerConsole.sendLog("error", message);
    }

    /**
     * Initializes the PlayerManager by setting up message interceptors and event listeners to manage media playback.
     */
    initPlayerManager() {
        this.playerManager.setMessageInterceptor(cast.framework.messages.MessageType.LOAD, async (request) => {

            if (!this.isPlaying) {
                this.mediaPlayer.hidePlayer();
                this.carousel.stopCarousel();
            }

            // NOTE: For Development only
            this.debuggerConsole.sendLog("info", "Before modifying the request " + JSON.stringify(request, null, 4));

            const { media } = request;
            const mediaInfo = this.mediaPlayer.playMedia(media);
            request.media = mediaInfo;

            // NOTE: For Development only
            this.debuggerConsole.sendLog("info", "Before modifying the request " + JSON.stringify(request, null, 4));

            this.isPlaying = true;

            return request;

        });

        // Add event listeners based on EventType
        Object.keys(EventType).forEach(event => {
            this.playerManager.addEventListener(event, (e) => this.handleEvent(e, EventType[event]));
        });

    }

    /**
    * Handles various media player events and takes appropriate actions based on the event type.
    * @param {cast.framework.events.Event} event - The event triggered from the player.
    * @param {string} message - The predefined message associated with the event.
    */
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
                    this.isPlaying = false;
                    this.carousel.startCarousel();
                }
                break;
            case types.ERROR:
                const error = Object.values(ErrorCodes).find((e) => e.code === event.detailedErrorCode);
                const errorMessage = error ? `Error ${error.code}: ${error.message}` : `Unknown Error Code - ${event.detailedErrorCode}`;
                this.debuggerConsole.sendLog("error", errorMessage);
                if (!this.carousel.isPlaying()) {
                    this.mediaPlayer.mediaPlayer.classList.toggle("hidden");
                    this.carousel.startCarousel();
                }
                break;
            case types.MEDIA_STATUS:
                this.debuggerConsole.sendLog("debug", message + ": " + JSON.stringify(event, null, 4));
                break;
            default:
                break;
        }
    }

    /**
     * Starts the Cast Receiver context. This method should be called once to configure and initiate the receiver application.
     * @param {Object} options - Configuration options for the Cast context, such as disabling idle timeout during development.
     */
    startContext() {
        this.context.start({
            // NOTE: Development only
            disableIdleTimeout: true,
        });
    }
}

export default PlayerManager;
