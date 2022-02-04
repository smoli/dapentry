import {GrObject} from "../../geometry/GrObject";
import {ToolNames} from "../../tools/ToolNames";

export interface ToolState {
    current: ToolNames
}

export const toolState = {
    state():ToolState {
        return {
            current: null
        }
    },

    mutations: {
        switch(state:ToolState, toolName:ToolNames) {
            state.current = toolName;
        }
    }
}