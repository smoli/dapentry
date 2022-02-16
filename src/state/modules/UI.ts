import {shallowRef} from "vue";
import {ModalDialogHandler} from "../../ui/core/ModalDialogHandler";


export interface UIState {
    modalComponent: any,
    modalHandler: ModalDialogHandler,
}


export const uiState = {

    state(): UIState {
        return {
            modalComponent: null,
            modalHandler: null
        }
    },

    mutations: {
        showModal(state: UIState, payload: { component: any, handler: ModalDialogHandler }) {
            state.modalComponent = shallowRef(payload.component);
            state.modalHandler = payload.handler;
        },

        hideModal(state: UIState) {
            state.modalHandler = state.modalComponent = null;
        }
    }
}
