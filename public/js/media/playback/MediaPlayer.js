class MediaPlayer {
    constructor() {
        this.mediaPlayer = document.querySelector(".media");
    }

    createMediaInfo(customMediaData, request) {

        request.media.contentId = customMediaData;
        request.media.streamType = cast.framework.messages.StreamType.BUFFERED;
        request.media.contentType = "application/x-mpegurl"; // Adjust based on your video content type

        // Add any additional metadata as needed
        request.media.metadata = new cast.framework.messages.GenericMediaMetadata();
        request.media.metadata.title = customMediaData.title || "Unknown Title"; // Add title if available

    }

    // WARN: For now its playing only by the media url
    playMedia(media) {

        // Showing the media Player
        this.mediaPlayer.classList.toggle("hidden");

        // Create a MediaInfo object
        const mediaInfo = new cast.framework.messages.MediaInformation();
        mediaInfo.contentId = media.contentUrl;
        mediaInfo.contentType = media.contentType;
        mediaInfo.hlsSegmentFormat = cast.framework.messages.HlsSegmentFormat.FMP4;
        mediaInfo.hlsVideoSegmentFormat = cast.framework.messages.HlsVideoSegmentFormat.FMP4;
        mediaInfo.metadata = media.metadata;
        // mediaInfo.streamType = cast.framework.messages.StreamType.BUFFERED;


        return mediaInfo;
    }

    hidePlayer() {
        this.mediaPlayer.classList.toggle("hidden");
    }

}

export default MediaPlayer;
