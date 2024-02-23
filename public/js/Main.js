import DebuggerConsole  from "./Debugger.js";

const context = cast.framework.CastReceiverContext.getInstance();
const playerManager = context.getPlayerManager();

// Initializing the debugger
const debuggerConsole = new DebuggerConsole();
debuggerConsole.enableDebugOverlay(true);

const NAMESPACE = "urn:x-cast:com.skycast.chromecast.communication";
let communicationConstants = {};

// Custom Message Handler
// context.addCustomMessageListener(NAMESPACE, onMessage);

// playerManager.setMessageInterceptor(cast.framework.messages.MessageType.LOAD, async (request) => {
//     sendLog("info", "Intercepting LOAD request");

//     // Map contentId to entity
//     if (request.media && request.media.entity) {
//         request.media.contentId = request.media.entity;
//     }

//     try {
//         // Fetch repository metadata
//         const data = await makeRequest("GET", SAMPLE_URL);
//         // Obtain resources by contentId from downloaded repository metadata.
//         const item = data[request.media.contentId];
//         sendLog("info", request);
//         if (!item) {
//             // Content could not be found in repository
//             sendLog("error", "Content not found");
//             throw new Error("Content not found");
//         }

//         // Adjusting request to make requested content playable
//         request.media.contentType = TEST_STREAM_TYPE;

//         // Configure player for content type
//         request.media.contentUrl = TEST_STREAM_TYPE === StreamType.DASH ? item.stream.dash : item.stream.hls;
//         if (TEST_STREAM_TYPE === StreamType.HLS) {
//             request.media.hlsSegmentFormat = cast.framework.messages.HlsSegmentFormat.FMP4;
//             request.media.hlsVideoSegmentFormat = cast.framework.messages.HlsVideoSegmentFormat.FMP4;
//         }

//         castDebugLogger.warn(LOG_TAG, "Playable URL:", request.media.contentUrl);

//         // Add metadata
//         request.media.metadata = new cast.framework.messages.GenericMediaMetadata();
//         request.media.metadata.title = item.title;
//         request.media.metadata.subtitle = item.author;

//         return request;
//     } catch (error) {
//         castDebugLogger.error(LOG_TAG, "Error processing request:", error);
//         throw error;
//     }
// });

context.start({
    disableIdleTimeout: true,
});
