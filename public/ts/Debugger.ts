import { LoggerLevel } from "chromecast-caf-receiver/cast.framework";
import { CastDebugLogger } from "chromecast-caf-receiver/cast.debug";
import { EventType } from "chromecast-caf-receiver/cast.framework.events";

export enum DebugMessagesEnum {
    INFO = "info",
    DEBUG = "debug",
    ERROR = "error",
    WARN = "warn",
}
export type DebugMessagesType = typeof DebugMessagesEnum[keyof typeof DebugMessagesEnum];


// Define the type that uses the enum values
enum LoggerTypeEnum {
    Events = "events",
    Tags = "tags",
}
// TODO Check if its worth it
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type LoggerType = typeof LoggerTypeEnum[keyof typeof LoggerTypeEnum];

// Event Types
export enum LoggerEventTypesEnum {
    EventType = "EventType",
    category = "category"
}
// ! Check if its needed
// type LoggerEventEventTypes = typeof EventTypesEnum[keyof typeof EventTypesEnum];

enum CategoryEnum {
    CORE = "CORE",
    DEBUG = "DEBUG",
    FINE = "FINE",
    REQUEST = "REQUEST",
}


interface EventTypeInputObject {
    type: LoggerEventTypesEnum.EventType;
    // data: Record<EventType, LoggerLevel>;
    data: Record<string, LoggerLevel>;
}
interface CategoryInputObject {
    type: LoggerEventTypesEnum.category;
    // data: Record<CategoryEnum, LoggerLevel>;
    data: Record<string, LoggerLevel>;
}
type InputObject = EventTypeInputObject | CategoryInputObject;


export class DebuggerConsole {

    private static instance: DebuggerConsole;
    private debuggerConsole: CastDebugLogger;
    private logTag: string;

    private constructor() {
        this.debuggerConsole = cast.debug.CastDebugLogger.getInstance();
        this.logTag = "DebuggerConsole.LOG";
    }

    public static getInstance(): DebuggerConsole {
        if (!DebuggerConsole.instance) {
            DebuggerConsole.instance = new DebuggerConsole();
        }
        return DebuggerConsole.instance;
    }

    /**
     * enableDebugOverlay
     */
    public enableDebugOverlay() {
        this.debuggerConsole.setEnabled(true);
    }

    // TODO Check if it works
    /**
     * setLoggerLevelTags
     */
    public setLoggerLevelTags(custom_tag: string, loggerLevel: LoggerLevel) {

        switch (loggerLevel) {
            case LoggerLevel.DEBUG:
                this.debuggerConsole.loggerLevelByTags = { custom_tag: cast.framework.LoggerLevel.DEBUG };
                break;
            case LoggerLevel.INFO:
                this.debuggerConsole.loggerLevelByTags = { custom_tag: cast.framework.LoggerLevel.INFO };
                break;
            case LoggerLevel.ERROR:
                this.debuggerConsole.loggerLevelByTags = { custom_tag: cast.framework.LoggerLevel.ERROR };
                break;
            case LoggerLevel.VERBOSE:
                this.debuggerConsole.loggerLevelByTags = { custom_tag: cast.framework.LoggerLevel.VERBOSE };
                break;
            case LoggerLevel.WARNING:
                this.debuggerConsole.loggerLevelByTags = { custom_tag: cast.framework.LoggerLevel.WARNING };
                break;
            case LoggerLevel.NONE:
                this.debuggerConsole.loggerLevelByTags = { custom_tag: cast.framework.LoggerLevel.NONE };
                break;

            default:
                this.debuggerConsole.loggerLevelByTags = { custom_tag: cast.framework.LoggerLevel.NONE };
                break;
        }
    }

    /**
     * setLoggerLevel
     */
    public setLoggerLevelEvents(object: InputObject) {

        const { type, data } = object;
        let eventKeyString: string = "cast.framework.events.";

        if (type == "EventType") {

            eventKeyString += LoggerEventTypesEnum.EventType;
            // For each value in the record we are going to add it to the CastDebugLogger.loggerLevelByEvents
            // ? If the value of the LoggerLevel is not Valid is the same as None
            Object.entries(data).forEach(([key, value]) => {

                // Ex: cast.framework.events.EventType.MEDIA_STATUS
                const keyString: string = eventKeyString + key;

                switch (value) {
                    case LoggerLevel.DEBUG:
                        this.debuggerConsole.loggerLevelByEvents[keyString] = cast.framework.LoggerLevel.DEBUG;
                        break;
                    case LoggerLevel.INFO:
                        this.debuggerConsole.loggerLevelByEvents[keyString] = cast.framework.LoggerLevel.INFO;
                        break;
                    case LoggerLevel.ERROR:
                        this.debuggerConsole.loggerLevelByEvents[keyString] = cast.framework.LoggerLevel.ERROR;
                        break;
                    case LoggerLevel.VERBOSE:
                        this.debuggerConsole.loggerLevelByEvents[keyString] = cast.framework.LoggerLevel.VERBOSE;
                        break;
                    case LoggerLevel.WARNING:
                        this.debuggerConsole.loggerLevelByEvents[keyString] = cast.framework.LoggerLevel.WARNING;
                        break;
                    case LoggerLevel.NONE:
                        this.debuggerConsole.loggerLevelByEvents[keyString] = cast.framework.LoggerLevel.NONE;
                        break;

                    default:
                        this.debuggerConsole.loggerLevelByEvents[keyString] = cast.framework.LoggerLevel.NONE;
                        break;
                }
            });
        }
        if (type == "category") {

            eventKeyString += LoggerEventTypesEnum.category;

            Object.entries(data).forEach(([key, value]) => {

                const keyString: string = eventKeyString + key;

                switch (value) {
                    case LoggerLevel.DEBUG:
                        this.debuggerConsole.loggerLevelByEvents[keyString] = cast.framework.LoggerLevel.DEBUG;
                        break;
                    case LoggerLevel.INFO:
                        this.debuggerConsole.loggerLevelByEvents[keyString] = cast.framework.LoggerLevel.INFO;
                        break;
                    case LoggerLevel.ERROR:
                        this.debuggerConsole.loggerLevelByEvents[keyString] = cast.framework.LoggerLevel.ERROR;
                        break;
                    case LoggerLevel.VERBOSE:
                        this.debuggerConsole.loggerLevelByEvents[keyString] = cast.framework.LoggerLevel.VERBOSE;
                        break;
                    case LoggerLevel.WARNING:
                        this.debuggerConsole.loggerLevelByEvents[keyString] = cast.framework.LoggerLevel.WARNING;
                        break;
                    case LoggerLevel.NONE:
                        this.debuggerConsole.loggerLevelByEvents[keyString] = cast.framework.LoggerLevel.NONE;
                        break;
                    default:
                        this.debuggerConsole.loggerLevelByEvents[keyString] = cast.framework.LoggerLevel.NONE;
                        break;
                }

            });
        }


    }

    /**
     * sendLog
     */
    // public sendLog(type: DebugMessagesType = DebugMessagesEnum.INFO, custom_tag: string, ...message: any[]) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public sendLog(type: DebugMessagesType = DebugMessagesEnum.INFO, ...message: any[]) {
        switch (type) {
            case DebugMessagesEnum.DEBUG:
                // this.debuggerConsole.debug(custom_tag, message);
                this.debuggerConsole.debug(this.logTag, message);
                break;
            case DebugMessagesEnum.INFO:
                // this.debuggerConsole.info(custom_tag, message);
                this.debuggerConsole.info(this.logTag, message);
                break;
            case DebugMessagesEnum.ERROR:
                // this.debuggerConsole.error(custom_tag, message);
                this.debuggerConsole.error(this.logTag, message);
                break;
            case DebugMessagesEnum.WARN:
                // this.debuggerConsole.warn(custom_tag, message);
                this.debuggerConsole.warn(this.logTag, message);
                break;

            default:
                // this.debuggerConsole.info(custom_tag, message);
                this.debuggerConsole.info(this.logTag, message);
                break;
        }
    }


}