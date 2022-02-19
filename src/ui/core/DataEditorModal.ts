import {DialogCloseReason} from "./ModalFactory";
import {ModalDialogHandler} from "./ModalDialogHandler";


export const DataEditorModalComponent = {
    props: ["handler"],

    computed: {

        closeText() {
            return this.handler.closeButtonText;
        },

        caption() {
            return this.handler.caption;
        }
    },

    methods: {
        onClose() {
            this.handler.closeDataEditor();
        }
    },

    template: `
      <div class="drawable-data-editor-modal">
      <h1>{{ $t("ui.dataEditor") }}</h1>
      <DataEditor hide-caption="true"></DataEditor>
      <div class="drawable-modal-footer">
        <button @click="onClose" class="drawable-ui-accept">{{ closeText }}</button>
      </div>
      </div>
      `
}


export class DataEditorModal extends ModalDialogHandler {

    get closeButtonText(): string {
        return this.t("ui.yes");
    }

    get caption(): string {
        return this.t("ui.confirm");
    }

    closeDataEditor() {
        this.close(DialogCloseReason.YES);
    }
}