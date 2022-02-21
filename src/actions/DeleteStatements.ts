import {BaseAction} from "./BaseAction";
import {DataFieldValue} from "../state/modules/Data";
import {DialogCloseReason} from "../ui/core/ModalFactory";
import {CodeManager} from "../runtime/CodeManager";

export class DeleteStatements extends BaseAction {
    private readonly _indexes: Array<number>;

    constructor(indexes: Array<number>) {
        super();
        this._indexes = indexes;
    }

    get codeManager(): CodeManager {
        return this.state.store.state.code.codeManager;
    }

    protected async _execute(data: any): Promise<any> {
        let deletesOthers = false;
        let creates = null;
        for (const i of this._indexes) {
            creates = this.codeManager.getCreatedRegisterForStatement(i);
            if (creates) {
                const lines = this.codeManager.getStatementIndexesWithParticipation(creates);
                if (lines.length > 1) {
                    deletesOthers = true;
                    break;
                }
            }
        }

        if (deletesOthers) {
            const dialog = this.controller.modalFactory.createConfirmationModal();

            const reason = await dialog.show({
                text: `This statement creates "${creates}". It is used in other statements that must also be deleted.`,
                caption: "Delete statement for object?",
                yesButtonTextId: "Yes, delete",
                noButtonTextId: "No, keep statement"
            })

            if (reason === DialogCloseReason.YES) {
                this.state.removeStatements(this._indexes);
            }
        } else {
            this.state.removeStatements(this._indexes);
        }



/*        const dialog = this.controller.modalFactory.createConfirmationModal();
        const reason = await dialog.show({
            text: "Are you sure, you want to delete data field " + this._indexes + "?",
            caption: "Delete field?",
            yesButtonTextId: "Yes, delete",
            noButtonTextId: "No, keep field"
        })

        if (reason === DialogCloseReason.YES) {
            this.state.removeDataField(this._indexes);
        }*/
    }
}