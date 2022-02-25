import {State} from "../../state/State";
import {ConfirmationModalComponent, ConfirmationModal} from "./ConfirmationModal";
import {InfoModalComponent, InfoModalHandler} from "./InfoModal";
import {ModalDialogHandler} from "./ModalDialogHandler";
import {DataEditorModal, DataEditorModalComponent} from "./DataEditorModal";

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


    public createModal<T>(component:any, HandlerClass: (typeof ModalDialogHandler)):T {
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

    createConfirmationModal():ConfirmationModal {
        return this.createModal<ConfirmationModal>(ConfirmationModalComponent, ConfirmationModal);
    }

    createInfoModal():InfoModalHandler {
        return this.createModal<InfoModalHandler>(InfoModalComponent, InfoModalHandler);
    }

    createDataEditorModal():DataEditorModal {
        return this.createModal<DataEditorModal>(DataEditorModalComponent, DataEditorModal);
    }

}