import {createStore, Store} from "vuex";
import {DrawingState, drawingState} from "./modules/Drawing";
import {toolState, ToolState} from "./modules/Tool";
import {codeState, CodeState} from "./modules/Code";
import {DataState, dataState} from "./modules/Data";
import {uiState, UIState} from "./modules/UI";
import {libraryState, LibraryState} from "./modules/Library";
import {authenticationState, AuthenticationState} from "./modules/Authentication";

export interface AppStore {
    auth: AuthenticationState,
    drawing: DrawingState,
    tool: ToolState,
    code: CodeState,
    data: DataState,
    ui: UIState,
    library: LibraryState,
}


export function createAppStore(): Store<AppStore> {
    return createStore<AppStore>({
        modules: {
            auth: {
                namespaced: true,
                ...authenticationState
            },

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
            },
            ui: {
                namespaced: true,
                ...uiState
            },
            library: {
                namespaced: true,
                ...libraryState
            }
        }
    });
}


