import {createStore, Store} from "vuex";
import {DrawingState, drawingState} from "./modules/Drawing";

export interface AppState {
    drawing: DrawingState
}

export const appState: Store<AppState> = createStore<AppState>({
    modules: {
        drawing: {
            namespaced: true,
            ...drawingState
        }
    }
});

