// All types of event that the app can request
const EventTypes = {
    LOADVIDEO : "loadVideo",
    NEXTVIDEO : "nextVideo",
    PREVIOUSVIDEO : "previousVideo",
    PLAYVIDEO : "playVideo",
    PAUSEVIDEO : "pauseVideo",
    MUTE : "mute",
    UNMUTE : "unmute",
    SETVOLUME : "setVolume",
    PLAYAT : "playAt",
}

// What the functions of the event need
const LoadVideoEvent =  {
    type: EventTypes.LOADVIDEO,
}
const NextVideoEvent = {
    type: EventTypes.NEXTVIDEO,
}
const PreviousVideoEvent = {
    type: EventTypes.PREVIOUSVIDEO,
}
const PlayVideoEvent = {
    type: EventTypes.PLAYVIDEO,
}
const PauseVideoEvent = {
    type: EventTypes.PAUSEVIDEO,
}
const MuteVideoEvent = {
    type: EventTypes.MUTE,
}
const UnmuteVideoEvent = {
    type: EventTypes.UNMUTE,
}
const SetVolumeEvent = {
    type: EventTypes.SETVOLUME,
}
const PlayAtEvent = {
    type: EventTypes.PLAYAT,
}


// TODO
function handleChromecastEvent(event) {
    switch (event.type) {
        case EventTypes.LOADVIDEO:
            // Handle load video event
            break;
        case EventTypes.NEXTVIDEO:
            // Handle next video event
            break;
        // Add cases for other event types as needed
        default:
            console.warn("Unhandled event type:", event.type);
    }
}
