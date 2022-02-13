import {ToolNames} from "../../tools/ToolNames";
import {GrObject} from "../../geometry/GrObject";

export interface ToolState {
    current: ToolNames,
    referenceObject: GrObject,
    keyPress: KeyboardEvent,
    available: Array<ToolNames>
}

export const toolState = {
    state():ToolState {
        return {
            current: null,
            referenceObject: null,
            keyPress: null,
            available: []

        }
    },

    mutations: {
        setAvailable(state: ToolState, tools: Array<ToolNames>) {
            state.available = tools;
        },

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