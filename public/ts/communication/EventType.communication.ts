// All types of event that the app can request
enum EventTypes {
    LOADVIDEO = "loadVideo",
    NEXTVIDEO = "nextVideo",
    PREVIOUSVIDEO = "previousVideo",
    PLAYVIDEO = "playVideo",
    PAUSEVIDEO = "pauseVideo",
    MUTE = "mute",
    UNMUTE = "unmute",
    SETVOLUME = "setVolume",
    PLAYAT = "playAt",
}

// What the functions of the event need
interface LoadVideoEvent {
    type: EventTypes.LOADVIDEO;
}
interface NextVideoEvent {
    type: EventTypes.NEXTVIDEO;
}
interface PreviousVideoEvent {
    type: EventTypes.PREVIOUSVIDEO;
}
interface PlayVideoEvent {
    type: EventTypes.PLAYVIDEO;
}
interface PauseVideoEvent {
    type: EventTypes.PAUSEVIDEO;
}
interface MuteVideoEvent {
    type: EventTypes.MUTE;
}
interface UnmuteVideoEvent {
    type: EventTypes.UNMUTE;
}
interface SetVolumeEvent {
    type: EventTypes.SETVOLUME;
}
interface PlayAtEvent {
    type: EventTypes.PLAYAT;
}

// A type that unifies all this event into one
export type ChromecastEvent =
    | LoadVideoEvent
    | NextVideoEvent
    | PreviousVideoEvent
    | PlayVideoEvent
    | PauseVideoEvent
    | MuteVideoEvent
    | UnmuteVideoEvent
    | SetVolumeEvent
    | PlayAtEvent;
