import {ToolNames} from "../../tools/ToolNames";
import {GrObject} from "../../geometry/GrObject";
import {InteractionEventData} from "../../drawing/InteractionEvents";

export interface ToolState {
    current: ToolNames,
    referenceObject: GrObject,
    keyPress: KeyboardEvent
}

export const toolState = {
    state():ToolState {
        return {
            current: null,
            referenceObject: null,
            keyPress: null

        }
    },

    mutations: {
        switch(state:ToolState, toolName:ToolNames) {
            state.current = toolName;
        },

        setReferenceObject(state:ToolState, object: GrObject) {
            state.referenceObject = object;
        },

        setKeyPress(state:ToolState, event: KeyboardEvent) {
            state.keyPress = event;
        }
    },
    getters: {
        referenceObject(state:ToolState) {
            return state.referenceObject;
        }
    }
}