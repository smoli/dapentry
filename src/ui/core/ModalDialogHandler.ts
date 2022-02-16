import {I18n} from "vue-i18n";
import {ASSERT} from "../../core/Assertions";
import {DialogCloseReason} from "./ModalFactory";

export class ModalDialogHandler {
    private readonly _onClose: () => void;
    private readonly _onShow: () => void;
    private readonly _i18n: I18n;

    private _resolve: (value: DialogCloseReason) => void;
    private _reject: (reason?: any) => void;
    private _showing: boolean = false;

    constructor(onShow: () => void, onClose: () => void, i18n: I18n) {
        this._onShow = onShow;
        this._onClose = onClose;
        this._i18n = i18n;
    }

    get i18n(): I18n {
        return this._i18n;
    }

    protected t(id: string): string {
        // @ts-ignore
        return this.i18n.global.t(id);
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


