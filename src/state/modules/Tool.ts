import {ToolNames} from "../../tools/ToolNames";
import {GrObject} from "../../geometry/GrObject";

export interface ToolState {
    current: ToolNames,
    currentParams: Array<any>,
    referenceObject: GrObject,
    keyPress: KeyboardEvent,
    available: Array<ToolNames>
}

export const toolState = {
    state():ToolState {
        return {
            current: null,
            currentParams: null,
            referenceObject: null,
            keyPress: null,
            available: []

        }
    },

    mutations: {
        setAvailable(state: ToolState, tools: Array<ToolNames>) {
            state.available = tools;
        },

        switch(state:ToolState, payload: { toolName:ToolNames, params: Array<any>}) {
            state.current = payload.toolName;
            state.currentParams = payload.params;
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