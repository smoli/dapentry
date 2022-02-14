import {State} from "../../state/State";
import InfoModal from "../../ui/core/InfoModal.vue";
import ConfirmationModal from "../../ui/core/ConfirmationModal.vue";
import {ASSERT} from "../../core/Assertions";

export enum DialogCloseReason {
    OK,
    CANCEL,
    YES,
    NO
}

export class ModalDialog {
    private readonly _onClose: () => void;
    private readonly _onShow: () => void;
    private _resolve: (value: DialogCloseReason) => void;
    private _reject: (reason?: any) => void;
    private _showing: boolean = false;

    constructor(onShow: () => void, onClose: () => void) {
        this._onShow = onShow;
        this._onClose = onClose;
    }

    show() {
        ASSERT(this._showing === false, "Dialog already showing");

        this._showing = true;
        this._onShow();
        return new Promise((res, rej) => {
            this._resolve = res;
            this._reject = rej;
        });
    }

    cancel() {
        this._onClose();
        this._resolve(DialogCloseReason.CANCEL);
    }

    close(reason: DialogCloseReason) {
        this._onClose();
        this._resolve(reason);
    }

    protected resolve(reason: DialogCloseReason) {
        this._resolve(reason);
    }

    protected reject(error) {
        this._reject(error);
    }
}

export class ConfirmationModalHandler extends ModalDialog {
    yes() {
        this.close(DialogCloseReason.YES);
    }

    no() {
        this.close(DialogCloseReason.NO);
    }
}


export class ModalFactory {
    private _state: State;

    constructor(state: State) {
        this._state = state;
    }

    createConfirmationModal() {
        const handler = new ConfirmationModalHandler(
            () => {
                this._state.showModal(ConfirmationModal, handler);
            },

            () => {
                this._state.hideModal();
            });

        return handler;
    }

    createInfoModal() {
        const handler = new ModalDialog(
            () => {
                this._state.showModal(InfoModal, handler);
            },

            () => {
                this._state.hideModal();
            });

        return handler;

    }

}