import {GrObject} from "../../Geo/GrObject";

export enum InteractionEvents {
    Click,
    AlternateClick,
    MouseDown,
    MouseUp,
    MouseMove,
    MouseLeave,
    MouseEnter,
    Selection,
    Key,
    Cancel
}

export interface InteractionEventData {
    interactionEvent: InteractionEvents,
    x: number,
    y: number,
    dx: number,
    dy: number,
    button: number,
    buttons: boolean,
    ctrl: boolean,
    shift: boolean,
    alt: boolean,
    key: string,
    keyCode: number,
    selection?: Array<GrObject>
}
