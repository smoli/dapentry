import {createStore, Store} from "vuex";
import {DrawingState, drawingState} from "./modules/Drawing";
import {toolState, ToolState} from "./modules/Tool";
import {codeState, CodeState} from "./modules/Code";

export interface AppStore {
    drawing: DrawingState,
    tool: ToolState,
    code: CodeState
}


export function createAppStore() {
    return createStore<AppStore>({
        modules: {
            drawing: {
                namespaced: true,
                ...drawingState
            },
            tool: {
                namespaced: true,
                ...toolState
            },
            code: {
                namespaced: true,
                ...codeState
            }
        }
    });
}


