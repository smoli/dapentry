import {createStore, Store} from "vuex";
import {DrawingState, drawingState} from "./modules/Drawing";
import {toolState, ToolState} from "./modules/Tool";

export interface AppState {
    drawing: DrawingState,
    tool: ToolState
}

export const appState: Store<AppState> = createStore<AppState>({
    modules: {
        drawing: {
            namespaced: true,
            ...drawingState
        },
        tool: {
            namespaced: true,
            ...toolState
        }
    }
});

