import {BaseAction} from "./BaseAction";
import {DataFieldValue} from "../state/modules/Data";
import {DialogCloseReason} from "../ui/core/ModalFactory";

export class RemoveDataField extends BaseAction {
    private readonly _name: string;

    constructor(name: string) {
        super();
        this._name = name;
    }

    protected async _execute(data: any): Promise<any> {
        const dialog = this.controller.modalFactory.createConfirmationModal();
        const reason = await dialog.show("Delete data field " + this._name + "?");
        if (reason === DialogCloseReason.YES) {
            this.state.removeDataField(this._name);
        }
    }
}