/**
 * This enumeration contains error codes and messages related to different types of errors,
 * including application errors, network errors, media errors, and more.
 * Each property of the enum is an object containing both a `code` and a `message` that
 * describes the error.
 * 
 * @enum {Object}
 */
const ErrorCodes = {
    /** Application error, occurs outside of the framework (e.g., event handler errors). */
    APP: { code: 900, message: "An error occurs outside of the framework (e.g., if an event handler throws an error)." },

    /** Break clip load interceptor fails. */
    BREAK_CLIP_LOADING_ERROR: { code: 901, message: "Break clip load interceptor fails." },

    /** Break seek interceptor fails. */
    BREAK_SEEK_INTERCEPTOR_ERROR: { code: 902, message: "Break seek interceptor fails." },

    /** A DASH manifest contains invalid segment info. */
    DASH_INVALID_SEGMENT_INFO: { code: 423, message: "A DASH manifest contains invalid segment info." },

    /** A DASH manifest is missing a MimeType. */
    DASH_MANIFEST_NO_MIMETYPE: { code: 422, message: "A DASH manifest is missing a MimeType." },

    /** A DASH manifest is missing periods. */
    DASH_MANIFEST_NO_PERIODS: { code: 421, message: "A DASH manifest is missing periods." },

    /** An unknown error occurs while parsing a DASH manifest. */
    DASH_MANIFEST_UNKNOWN: { code: 420, message: "An unknown error occurs while parsing a DASH manifest." },

    /** An unknown network error occurs while handling a DASH stream. */
    DASH_NETWORK: { code: 321, message: "An unknown network error occurs while handling a DASH stream." },

    /** A DASH stream is missing an init. */
    DASH_NO_INIT: { code: 322, message: "A DASH stream is missing an init." },

    /** Generic error, returned when an unknown error occurs. */
    GENERIC: { code: 999, message: "Returned when an unknown error occurs." },

    /** An error occurs while parsing an HLS master manifest. */
    HLS_MANIFEST_MASTER: { code: 411, message: "An error occurs while parsing an HLS master manifest." },

    /** An error occurs while parsing an HLS playlist. */
    HLS_MANIFEST_PLAYLIST: { code: 412, message: "An error occurs while parsing an HLS playlist." },

    /** An HLS segment is invalid. */
    HLS_NETWORK_INVALID_SEGMENT: { code: 315, message: "An HLS segment is invalid." },

    /** A request for an HLS key fails before it is sent. */
    HLS_NETWORK_KEY_LOAD: { code: 314, message: "A request for an HLS key fails before it is sent." },

    /** An HLS master playlist fails to download. */
    HLS_NETWORK_MASTER_PLAYLIST: { code: 311, message: "An HLS master playlist fails to download." },

    /** An HLS key fails to download. */
    HLS_NETWORK_NO_KEY_RESPONSE: { code: 313, message: "An HLS key fails to download." },

    /** An HLS playlist fails to download. */
    HLS_NETWORK_PLAYLIST: { code: 312, message: "An HLS playlist fails to download." },

    /** An HLS segment fails to parse. */
    HLS_SEGMENT_PARSING: { code: 316, message: "An HLS segment fails to parse." },

    /** When an image fails to load. */
    IMAGE_ERROR: { code: 903, message: "When an image fails to load." },

    /** A load command failed. Verify the load request is set up properly and the media is able to play. */
    LOAD_FAILED: { code: 905, message: "A load command failed. Verify the load request is set up properly and the media is able to play." },

    /** A load was interrupted by an unload, or by another load. */
    LOAD_INTERRUPTED: { code: 904, message: "A load was interrupted by an unload, or by another load." },

    /** An unknown error occurs while parsing a manifest. */
    MANIFEST_UNKNOWN: { code: 400, message: "An unknown error occurs while parsing a manifest." },

    /** There is a media keys failure due to a network issue. */
    MEDIAKEYS_NETWORK: { code: 201, message: "There is a media keys failure due to a network issue." },

    /** There is an unknown error with media keys. */
    MEDIAKEYS_UNKNOWN: { code: 200, message: "There is an unknown error with media keys." },

    /** A MediaKeySession object cannot be created. */
    MEDIAKEYS_UNSUPPORTED: { code: 202, message: "A MediaKeySession object cannot be created." },

    /** Crypto failed. */
    MEDIAKEYS_WEBCRYPTO: { code: 203, message: "Crypto failed." },

    /** The fetching process for the media resource was aborted by the user agent at the user's request. */
    MEDIA_ABORTED: { code: 101, message: "The fetching process for the media resource was aborted by the user agent at the user's request." },

    /** An error occurred while decoding the media resource, after the resource was established to be usable. */
    MEDIA_DECODE: { code: 102, message: "An error occurred while decoding the media resource, after the resource was established to be usable." },

    /** An error message was sent to the sender. */
    MEDIA_ERROR_MESSAGE: { code: 906, message: "An error message was sent to the sender." },

    /** A network error caused the user agent to stop fetching the media resource, after the resource was established to be usable. */
    MEDIA_NETWORK: { code: 103, message: "A network error caused the user agent to stop fetching the media resource, after the resource was established to be usable." },

    /** The media resource indicated by the src attribute was not suitable. */
    MEDIA_SRC_NOT_SUPPORTED: { code: 104, message: "The media resource indicated by the src attribute was not suitable." },

    /** The HTMLMediaElement throws an error, but CAF does not recognize the specific error. */
    MEDIA_UNKNOWN: { code: 100, message: "The HTMLMediaElement throws an error, but CAF does not recognize the specific error." },

    /** There was an unknown network issue. */
    NETWORK_UNKNOWN: { code: 300, message: "There was an unknown network issue." },

    /** A segment fails to download. */
    SEGMENT_NETWORK: { code: 301, message: "A segment fails to download." },
    
    /** An unknown segment error occurs. */
    SEGMENT_UNKNOWN: { code: 500, message: "An unknown segment error occurs." },
    
    /** An error occurs while parsing a Smooth manifest. */
    SMOOTH_MANIFEST: { code: 431, message: "An error occurs while parsing a Smooth manifest." },
    
    /** An unknown network error occurs while handling a Smooth stream. */
    SMOOTH_NETWORK: { code: 331, message: "An unknown network error occurs while handling a Smooth stream." },

    /** A Smooth stream is missing media data. */
    SMOOTH_NO_MEDIA_DATA: { code: 332, message: "A Smooth stream is missing media data." },

    /** A source buffer cannot be added to the MediaSource. */
    SOURCE_BUFFER_FAILURE: { code: 110, message: "A source buffer cannot be added to the MediaSource." },
    
    /** An error occurs while handling a text track. */
    TEXT_UNKNOWN: { code: 600, message: "An unknown error occurred with a text stream." },
    // Add any other error codes and messages here
};

export default ErrorCodes;