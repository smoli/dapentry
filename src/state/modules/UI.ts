import {shallowRef} from "vue";
import {ModalDialogHandler} from "../../ui/core/ModalDialogHandler";
import {layoutDefaults, LayoutOptions} from "../../core/makeDesigner";


export interface UIState {
    modalComponent: Array<{ component: any, handler: ModalDialogHandler }>,
    layout: LayoutOptions

}


export const uiState = {

    state(): UIState {
        return {
            modalComponent: [],
            layout: layoutDefaults
        }
    },

    mutations: {
        showModal(state: UIState, payload: { component: any, handler: ModalDialogHandler }) {
            state.modalComponent = [...state.modalComponent,
                { component: shallowRef(payload.component), handler: payload.handler }];
        },

        hideModal(state: UIState) {
            state.modalComponent.pop();
        },

        setLayout(state: UIState, layout: LayoutOptions) {
            Object.assign(state.layout, layout);
        },

        toggleLibrary(state: UIState) {
            const current = !!state.layout.hideLibrary;
            state.layout.hideLibrary = !current;
        }
    }
}
