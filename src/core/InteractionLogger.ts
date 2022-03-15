import {InteractionEventData, InteractionEventKind, InteractionEvents} from "./InteractionEvents";

interface SerializableEventData {
    kind: InteractionEventKind,
    interactionEvent: InteractionEvents,
    x: number,
    y: number,
    dx: number,
    dy: number,
    button: number,
    buttons: number,
    ctrl: boolean,
    shift: boolean,
    alt: boolean,
    key: string,
    keyCode: number,
    selection?: Array<string>,
    object?: string
}

class InteractionLogger {
    protected _log: Array<{ event: string, eventData: SerializableEventData }>;

    constructor() {
        this._log = [];
    }


    log(event: InteractionEvents, eventData?: InteractionEventData) {

        let ser: SerializableEventData;

        if (eventData) {
            ser = {
                ...eventData,
                object: eventData.object?.uniqueName,
                selection: eventData.selection?.map(o => o.uniqueName)
            }
        }

        if (event === InteractionEvents.MouseMove) {
            return;
        }

        this._log.push({ event: InteractionEvents[event], eventData: ser });

        if (localStorage) {
            localStorage.setItem("interactionLog", JSON.stringify(this._log));
        }
    }
}

const logger = new InteractionLogger();

export function logInteraction(event: InteractionEvents, eventData?: InteractionEventData) {
    logger.log(event, eventData);
}