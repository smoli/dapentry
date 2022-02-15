import {State} from "../../state/State";
import InfoModal from "../../ui/core/InfoModal.vue";
import ConfirmationModal from "../../ui/core/ConfirmationModal.vue";
import {ASSERT} from "../../core/Assertions";
import {I18n} from "vue-i18n";

export enum DialogCloseReason {
    OK,
    CANCEL,
    YES,
    NO
}

export class ModalDialog {
    private readonly _onClose: () => void;
    private readonly _onShow: () => void;
    private readonly _i18n: I18n;

    private _resolve: (value: DialogCloseReason) => void;
    private _reject: (reason?: any) => void;
    private _showing: boolean = false;

    constructor(onShow: () => void, onClose: () => void, i18n:I18n) {
        this._onShow = onShow;
        this._onClose = onClose;
        this._i18n = i18n;
    }

    get i18n():I18n {
        return this._i18n;
    }

    show(...params: Array<any>): Promise<any> {
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
        this._showing = false;
        this._resolve(DialogCloseReason.CANCEL);
    }

    close(reason: DialogCloseReason) {
        this._onClose();
        this._showing = false;
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
    private _text: string;
    private _yesButtonTextId: string;
    private _noButtonTextId: string;

    get text(): string {
        return this._text;
    }

    get noButtonText(): string {
        // @ts-ignore
        return this.i18n.global.t(this._noButtonTextId);
    }

    get yesButtonText(): string {
        // @ts-ignore
        return this.i18n.global.t(this._yesButtonTextId);
    }

    show(text: string, yesButtonTextId: string = "ui.yes", noButtonTextId: string = "ui.no"): Promise<any> {
        this._text = text;
        this._yesButtonTextId = yesButtonTextId;
        this._noButtonTextId = noButtonTextId;

        return super.show();
    }

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
            },
            this._state.i18n);

        return handler;
    }

    createInfoModal() {
        const handler = new ModalDialog(
            () => {
                this._state.showModal(InfoModal, handler);
            },

            () => {
                this._state.hideModal();
            },
            this._state.i18n);

        return handler;

    }

}