import {DialogCloseReason} from "./ModalFactory";
import {ModalDialog} from "./ModalDialog";

export interface ConfirmationModalOptions {
    text: string,
    yesButtonTextId?: string,
    noButtonTextId?: string,
    caption?: string
}

export class ConfirmationModalHandler extends ModalDialog {
    private _options: ConfirmationModalOptions;

    get text(): string {
        return this._options.text;
    }

    get noButtonText(): string {
        return this.t(this._options.noButtonTextId || "ui.no")
    }

    get yesButtonText(): string {
        return this.t(this._options.yesButtonTextId || "ui.yes");
    }

    get caption(): string {
        return this.t(this._options.caption || "ui.confirm");
    }

    show(options:ConfirmationModalOptions): Promise<any> {
        this._options = options;

        return super.show();
    }

    yes() {
        this.close(DialogCloseReason.YES);
    }

    no() {
        this.close(DialogCloseReason.NO);
    }
}