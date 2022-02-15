import {ModalDialog} from "../../ui/core/ModalFactory";
import {shallowRef} from "vue";


export interface UIState {
    modalComponent: any,
    modalHandler: ModalDialog,
}


export const uiState = {

    state(): UIState {
        return {
            modalComponent: null,
            modalHandler: null
        }
    },

    mutations: {
        showModal(state: UIState, payload: { component: any, handler: ModalDialog }) {
            state.modalComponent = shallowRef(payload.component);
            state.modalHandler = payload.handler;
        },

        hideModal(state: UIState) {
            state.modalHandler = state.modalComponent = null;
        }
    }
}