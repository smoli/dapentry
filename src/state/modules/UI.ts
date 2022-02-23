import {shallowRef} from "vue";
import {ModalDialogHandler} from "../../ui/core/ModalDialogHandler";


export interface UIState {
    modalComponent: Array<{ component: any, handler: ModalDialogHandler }>,

}


export const uiState = {

    state(): UIState {
        return {
            modalComponent: []
        }
    },

    mutations: {
        showModal(state: UIState, payload: { component: any, handler: ModalDialogHandler }) {
            state.modalComponent = [...state.modalComponent,
                { component: shallowRef(payload.component), handler: payload.handler }];
        },

        hideModal(state: UIState) {
            state.modalComponent.pop();
        }
    }
}
