import {State} from "../../state/State";
import InfoModal from "../../ui/core/InfoModal.vue";
import ConfirmationModal from "../../ui/core/ConfirmationModal.vue";
import {ConfirmationModalHandler} from "./ConfirmationModalHandler";
import {ModalDialog} from "./ModalDialog";

export enum DialogCloseReason {
    OK,
    CANCEL,
    YES,
    NO
}


export class ModalFactory {
    private _state: State;

    constructor(state: State) {
        this._state = state;
    }


    protected createModal<T>(component:any, HandlerClass: (typeof ModalDialog)):T {
        const handler = new HandlerClass(
            () => {
                this._state.showModal(component, handler);
            },

            () => {
                this._state.hideModal();
            },
            this._state.i18n);

        return handler as unknown as T;
    }

    createConfirmationModal():ConfirmationModalHandler {
        return this.createModal<ConfirmationModalHandler>(ConfirmationModal, ConfirmationModalHandler);
    }

    createInfoModal():ModalDialog {
        return this.createModal<ModalDialog>(InfoModal, ModalDialog);
    }

}