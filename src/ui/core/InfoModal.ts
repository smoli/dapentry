import {ModalDialogHandler} from "./ModalDialogHandler";

export const InfoModalComponent = {
    name: "InfoModal",
    props: ["handler"],

    computed: {
        caption() {
            return this.handler.caption;
        },

        text() {
            return this.handler.text;
        }
    },

    methods: {
        onClose() {
            this.handler.close();
        }
    },
    template: `
      <div class="drawable-modal-confirm">
      <h1>{{ caption }}</h1>
      <p>{{ text }}</p>
      <div class="drawable-modal-footer">
        <button class="drawable-ui-accept" @click="onClose">{{ $t("ui.ok") }}</button>
      </div>
      </div>
    `
}


export interface InfoModalOptions {
    text: string,
    caption?: string
}


export class InfoModalHandler extends ModalDialogHandler {
    private _options: InfoModalOptions;

    get text(): string {
        return this.t(this._options.text);
    }

    get caption(): string {
        return this.t(this._options.caption || "ui.information");
    }

    show(options: InfoModalOptions) {
        this._options = options;
        return super.show();
    }
}