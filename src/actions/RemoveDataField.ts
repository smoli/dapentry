import {BaseAction} from "./BaseAction";
import {DialogCloseReason} from "../ui/core/ModalFactory";

export class RemoveDataField extends BaseAction {
    private readonly _name: string;

    constructor(name: string) {
        super();
        this._name = name;
    }

    protected async _execute(data: any): Promise<any> {
        const dialog = this.controller.modalFactory.createConfirmationModal();
        const { reason } = await dialog.show({
            text: "Are you sure, you want to delete data field " + this._name + "?",
            caption: "Delete field?",
            yesButtonTextId: "Yes, delete",
            noButtonTextId: "No, keep field"
        })

        if (reason === DialogCloseReason.YES) {
            this.state.removeDataField(this._name);
        }
    }
}