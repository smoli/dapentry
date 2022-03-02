import {InteractionEventData, InteractionEventKind} from "../../src/core/InteractionEvents";
import {GrObject} from "../../src/geometry/GrObject";


export interface modifiers {
    alt?: boolean,
    shift?: boolean,
    ctrl?:boolean
}

let lastX;
let lastY;


export function makeAClick(x:number, y:number, button: number = 0, mods:modifiers = {} ): InteractionEventData {
    lastX = x;
    lastY = y;
    return {
        kind: InteractionEventKind.pointer,
        alt: !!mods.alt,
        button,
        buttons: 0,
        ctrl: !!mods.ctrl,
        dx: 0,
        dy: 0,
        interactionEvent: undefined,
        key: "",
        keyCode: 0,
        shift: !!mods.shift,
        x,
        y
    }
}

export function makeAMove(x: number, y: number, mods: modifiers = {}): InteractionEventData {
    const dx = x - lastX;
    const dy = y - lastY;
    lastX = x;
    lastY = y;
    return {
        kind: InteractionEventKind.pointer,
        alt: !!mods.alt,
        button: 0,
        buttons: 0,
        ctrl: !!mods.ctrl,
        dx,
        dy,
        interactionEvent: undefined,
        key: "",
        keyCode: 0,
        shift: !!mods.shift,
        x,
        y
    }
}

export function makeRefObjEvent(object: GrObject): InteractionEventData {
    const dx = 0;
    const dy = 0;

    return {
        alt: false,
        button: 0,
        buttons: 0,
        ctrl: false,
        dx: 0,
        dy: 0,
        interactionEvent: undefined,
        key: "",
        keyCode: 0,
        kind: InteractionEventKind.pointer,
        object,
        shift: false,
        x: lastX,
        y: lastY

    }
}

