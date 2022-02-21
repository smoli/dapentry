import {DialogCloseReason} from "./ModalFactory";
import {ModalDialogHandler} from "./ModalDialogHandler";


export const ConfirmationModalComponent = {
    props: ["handler"],

    computed: {
        text() {
            return this.handler.text;
        },

        yesText() {
            return this.handler.yesButtonText;
        },

        noText() {
            return this.handler.noButtonText;
        },

        caption() {
            return this.handler.caption;
        }
    },

    methods: {
        onYes() {
            this.handler.yes();
        },
        onNo() {
            this.handler.no();
        }
    },

    template: `
      <div class="drawable-modal-confirm">
      <h1>{{ caption }}</h1>
      <p>{{ text }}</p>
      <div class="drawable-modal-footer">
        <button @click="onYes" class="drawable-ui-accept">{{ yesText }}</button>
        <button @click="onNo" class="drawable-ui-decline">{{ noText }}</button>
      </div>
      </div>
    `
}


export interface ConfirmationModalOptions {
    text: string,
    yesButtonTextId?: string,
    noButtonTextId?: string,
    caption?: string
}

export class ConfirmationModal extends ModalDialogHandler {
    private _options: ConfirmationModalOptions;

    get text(): string {
        return this.t(this._options.text);
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

    async show(options: ConfirmationModalOptions): Promise<any> {
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