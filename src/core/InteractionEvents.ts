import {GrObject} from "../geometry/GrObject";

export enum InteractionEventKind {
    none,
    pointer,
    key
}
export enum InteractionEvents {
    Click,
    AlternateClick,
    MouseDown,
    MouseUp,
    MouseMove,
    MouseLeave,
    MouseEnter,
    Selection,
    ReferenceObject,
    Key,
    Cancel
}

export interface InteractionEventData {
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
    selection?: Array<GrObject>,
    object?: GrObject
}
