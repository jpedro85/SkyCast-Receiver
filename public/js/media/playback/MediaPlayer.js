/**
 * Handles media playback operations in a casting environment. The class is responsible
 * for managing media elements, updating media information, and controlling the visibility
 * of media players on the UI.
 */
class MediaPlayer {

    /**
    * Initializes the MediaPlayer by selecting the HTML element that acts as the media player container.
    */
    constructor() {
        this.mediaPlayer = document.querySelector(".media");
    }

    /**
     * Populates a `request` object with media information based on `customMediaData`.
     * The method updates the media content details such as ID, stream type, and content type.
     * @param {Object} mediaData - Custom data and metadata for the media.
     * @param {cast.framework.messages.MediaLoadRequestData} request - The request data object to be populated with media info.
     */
    createMediaInfo(mediaData, request) {

        request.media.contentId = mediaData;
        request.media.streamType = cast.framework.messages.StreamType.BUFFERED;
        // Adjust based on your video content type
        request.media.contentType = "application/x-mpegurl";

        // Add any additional metadata as needed
        request.media.metadata = new cast.framework.messages.GenericMediaMetadata();
        // Add title if available
        request.media.metadata.title = mediaData.title || "Unknown Title";

    }

    /**
    * Prepares and returns a `MediaInformation` object for playback based on provided media data.
    * @param {Object} media - The media data to create a media information object from.
    * @returns {cast.framework.messages.MediaInformation} The populated media information object.
    */
    playMedia(media) {

        // Create a MediaInfo object
        const mediaInfo = new cast.framework.messages.MediaInformation();
        mediaInfo.contentId = media.contentUrl;
        mediaInfo.contentType = media.contentType;
        mediaInfo.hlsSegmentFormat = cast.framework.messages.HlsSegmentFormat.FMP4;
        mediaInfo.hlsVideoSegmentFormat = cast.framework.messages.HlsVideoSegmentFormat.FMP4;
        mediaInfo.metadata = media.metadata;

        return mediaInfo;
    }

    /**
    * Toggles the visibility of the media player UI element, effectively showing or hiding it.
    */
    hidePlayer() {
        this.mediaPlayer.classList.toggle("hidden");
    }

}

export default MediaPlayer;
