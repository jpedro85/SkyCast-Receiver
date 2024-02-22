import { ChromecastEvent } from "./EventType.communication";

const something = "";


class MessageDispatcher {
    private communications;
    private callbacks: ChromecastEvent;

    constructor(communications:unknown, callbacks:ChromecastEvent) {
        this.communications = communications;
        this.callbacks= callbacks;
    }
}