import {InteractionEventData} from "../../src/core/InteractionEvents";


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

