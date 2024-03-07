// TODO: Implementation when cast sender is ready
class MediaPlayer {
    constructor() {}

    createMediaInfo(customMediaData, request) {

        request.media.contentId = customMediaData;
        request.media.streamType = cast.framework.messages.StreamType.BUFFERED;
        request.media.contentType = "application/x-mpegurl"; // Adjust based on your video content type

        // Add any additional metadata as needed
        request.media.metadata = new cast.framework.messages.GenericMediaMetadata();
        request.media.metadata.title = customMediaData.title || "Unknown Title"; // Add title if available

    }

    playMedia(media, request) {

        // this.createMediaInfo(media.contentUrl);;

        request.media.contentId = customMediaData;
        request.media.streamType = cast.framework.messages.StreamType.BUFFERED;
        request.media.contentType = "application/x-mpegurl"; // Adjust based on your video content type

        // Add any additional metadata as needed
        request.media.metadata = new cast.framework.messages.GenericMediaMetadata();
        request.media.metadata.title = customMediaData.title || "Unknown Title"; // Add title if available

        // Play the video automatically when loaded
        request.autoplay = true;
        request.currentTime = media.currentTime || 0;
    }
}

export default MediaPlayer;
