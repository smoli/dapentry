import {createStore, Store} from "vuex";
import {DrawingState, drawingState} from "./modules/Drawing";
import {toolState, ToolState} from "./modules/Tool";
import {codeState, CodeState} from "./modules/Code";
import {DataState, dataState} from "./modules/Data";

export interface AppStore {
    drawing: DrawingState,
    tool: ToolState,
    code: CodeState,
    data: DataState
}


export function createAppStore(): Store<AppStore> {
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
            },
            data: {
                namespaced: true,
                ...dataState
            }
        }
    });
}


