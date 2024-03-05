// TODO: Decide if this file is still needed

// All types of event that the app can request
const EventTypes = {
    LOADVIDEO: "loadVideo",
    NEXTVIDEO: "nextVideo",
    PREVIOUSVIDEO: "previousVideo",
    PLAYVIDEO: "playVideo",
    PAUSEVIDEO: "pauseVideo",
    MUTE: "mute",
    UNMUTE: "unmute",
    SETVOLUME: "setVolume",
    PLAYAT: "playAt",
}

const IdleEndReason = {
    STOPPED: cast.framework.events.EndedReason.STOPPED,
    END_OF_STREAM: cast.framework.events.EndedReason.END_OF_STREAM,
}

export default IdleEndReason;
