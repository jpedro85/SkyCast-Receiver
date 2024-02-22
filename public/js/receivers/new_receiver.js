const context = cast.framework.CastReceiverContext.getInstance();
const playerManager = context.getPlayerManager();

// Media Sample API Values
const SAMPLE_URL = "https://storage.googleapis.com/cpe-sample-media/content.json";
const StreamType = {
  DASH: 'application/dash+xml',
  HLS: 'application/x-mpegurl'
};
const TEST_STREAM_TYPE = StreamType.DASH;

// Debug Logger
const castDebugLogger = cast.debug.CastDebugLogger.getInstance();
const LOG_TAG = 'MyAPP.LOG';

// Enable debug logger and show a 'DEBUG MODE' overlay at top left corner.
castDebugLogger.setEnabled(true);

// castDebugLogger.showDebugLogs(true);


// Set verbosity level for Core events and custom tags.
castDebugLogger.loggerLevelByEvents = {
  'cast.framework.events.category.CORE': cast.framework.LoggerLevel.INFO,
  'cast.framework.events.EventType.MEDIA_STATUS': cast.framework.LoggerLevel.DEBUG
};
castDebugLogger.loggerLevelByTags = {
  LOG_TAG: cast.framework.LoggerLevel.DEBUG,
};

async function makeRequest(method, url) {
  try {
    const response = await fetch(url, { method });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}

playerManager.setMessageInterceptor(cast.framework.messages.MessageType.LOAD, async (request) => {
  castDebugLogger.info(LOG_TAG, 'Intercepting LOAD request');

  // Map contentId to entity
  if (request.media && request.media.entity) {
    request.media.contentId = request.media.entity;
  }

  try {
    // Fetch repository metadata
    const data = await makeRequest('GET', SAMPLE_URL);
    // Obtain resources by contentId from downloaded repository metadata.
    const item = data[request.media.contentId];
    castDebugLogger.info(LOG_TAG, request);
    if (!item) {
      // Content could not be found in repository
      castDebugLogger.error(LOG_TAG, 'Content not found');
      throw new Error('Content not found');
    }

    // Adjusting request to make requested content playable
    request.media.contentType = TEST_STREAM_TYPE;

    // Configure player for content type
    request.media.contentUrl = TEST_STREAM_TYPE === StreamType.DASH ? item.stream.dash : item.stream.hls;
    if (TEST_STREAM_TYPE === StreamType.HLS) {
      request.media.hlsSegmentFormat = cast.framework.messages.HlsSegmentFormat.FMP4;
      request.media.hlsVideoSegmentFormat = cast.framework.messages.HlsVideoSegmentFormat.FMP4;
    }

    castDebugLogger.warn(LOG_TAG, 'Playable URL:', request.media.contentUrl);

    // Add metadata
    request.media.metadata = new cast.framework.messages.GenericMediaMetadata();
    request.media.metadata.title = item.title;
    request.media.metadata.subtitle = item.author;

    return request;
  } catch (error) {
    castDebugLogger.error(LOG_TAG, 'Error processing request:', error);
    throw error;
  }
});

// Optimizing for smart displays
const touchControls = cast.framework.ui.Controls.getInstance();
const playerData = new cast.framework.ui.PlayerData();
const playerDataBinder = new cast.framework.ui.PlayerDataBinder(playerData);

async function getBrowseItems() {
  let browseItems = [];
  try {
    const data = await makeRequest('GET', SAMPLE_URL);
    Object.keys(data).forEach(key => {
      const item = data[key];
      browseItems.push({
        entity: key,
        title: item.title,
        subtitle: item.description,
        image: new cast.framework.messages.Image(item.poster),
        imageType: cast.framework.ui.BrowseImageType.MOVIE
      });
    });
  } catch (error) {
    console.error("Error fetching browse items:", error);
  }
  return browseItems;
}

async function setupBrowseContent() {
  const browseItems = await getBrowseItems();
  let browseContent = {
    title: 'Up Next',
    items: browseItems,
    targetAspectRatio: cast.framework.ui.BrowseImageAspectRatio.LANDSCAPE_16_TO_9
  };

  playerDataBinder.addEventListener(cast.framework.ui.PlayerDataEventType.MEDIA_CHANGED, (e) => {
    if (!e.value) return;

    // Media browse
    touchControls.setBrowseContent(browseContent);

    // Clear default buttons and re-assign
    touchControls.clearDefaultSlotAssignments();
    touchControls.assignButton(cast.framework.ui.ControlsSlot.SLOT_PRIMARY_1, cast.framework.ui.ControlsButton.SEEK_BACK_30);
  });
};

context.start();
