class MediaPlayer { constructor() {
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

        console.log(media.contentUrl)

        // Create a MediaInfo object
        const mediaInfo = new cast.framework.messages.MediaInformation();
        mediaInfo.contentId = media.contentUrl;
        // Change type as needed
        // INFO: Maybe it can come with the Load request for easier media fetching
        mediaInfo.contentType = "video/mp4";
        mediaInfo.streamType = cast.framework.messages.StreamType.BUFFERED;


        return mediaInfo;
    }

    hidePlayer(){
        this.mediaPlayer.classList.toggle("hidden");
    }

}

export default MediaPlayer;
