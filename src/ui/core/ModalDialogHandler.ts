import {I18n} from "vue-i18n";
import {ASSERT} from "../../core/Assertions";
import {DialogCloseReason} from "./ModalFactory";

export interface DialogCloseInfo {
    reason: DialogCloseReason,
    data: any
}

export class ModalDialogHandler {
    private readonly _onClose: () => void;
    private readonly _onShow: () => void;
    private readonly _i18n: I18n;

    private _resolve: (value: DialogCloseInfo) => void;
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

    async show(...params: Array<any>): Promise<DialogCloseInfo> {
        ASSERT(this._showing === false, "Dialog already showing");

        this._showing = true;
        this._onShow();
        return new Promise((res, rej) => {
            this._resolve = res;
            this._reject = rej;
        });
    }

    cancel(data: any = null) {
        this._onClose();
        this._showing = false;
        this._resolve({
            reason: DialogCloseReason.CANCEL,
            data
        });
    }

    close(reason: DialogCloseReason, data: any = null) {
        this._onClose();
        this._showing = false;
        this._resolve({ reason, data });
    }

    protected resolve(reason: DialogCloseReason, data: any = null) {
        this._resolve({ reason, data });
    }

    protected reject(error) {
        this._reject(error);
    }
}


