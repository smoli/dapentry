import {ToolNames} from "../../tools/ToolNames";
import {GrObject} from "@/geometry/GrObject";

export interface ToolState {
    current: ToolNames,
    referenceObject: GrObject
}

export const toolState = {
    state():ToolState {
        return {
            current: null,
            referenceObject: null
        }
    },

    mutations: {
        switch(state:ToolState, toolName:ToolNames) {
            state.current = toolName;
        },

        setReferenceObject(state:ToolState, object: GrObject) {
            state.referenceObject = object;
        }
    },
    getters: {
        referenceObject(state:ToolState) {
            return state.referenceObject;
        }
    }
}