import { CastReceiverContext } from "chromecast-caf-receiver/cast.framework";
import { DebugMessagesEnum, DebuggerConsole } from "../Debugger";
import { MessageProtocol } from "../MessageProtocol";

export class ChromecastChannel {
    private namespace;
    private context: CastReceiverContext;
    private debuggerConsoler: DebuggerConsole;

    constructor(namespace: string) {
        this.namespace = namespace;
        this.context = CastReceiverContext.getInstance();
        this.debuggerConsoler = DebuggerConsole.getInstance();
    }

    /**
     * sendMessage
     */
    public sendMessage(data: unknown) {
        if (!MessageProtocol.isMessageFormatted(data)) {
            this.debuggerConsoler.sendLog(DebugMessagesEnum.INFO, "MyApp.LOG", "object was not formated correctly" + data);
            return;
        }

        this.context.getSenders().forEach(sender => this.context.sendCustomMessage(this.namespace, sender.id, data))
    }
}