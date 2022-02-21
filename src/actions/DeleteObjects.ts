import {BaseAction} from "./BaseAction";
import {DataFieldValue} from "../state/modules/Data";
import {DialogCloseReason} from "../ui/core/ModalFactory";
import {CodeManager} from "../runtime/CodeManager";
import {GrObject} from "../geometry/GrObject";

export class DeleteObjects extends BaseAction {
    private readonly _objects: Array<GrObject>;

    constructor(objects: Array<GrObject>) {
        super();
        this._objects = objects;
    }

    get codeManager(): CodeManager {
        return this.state.store.state.code.codeManager;
    }

    protected async _execute(data: any): Promise<any> {

        const statements = this._objects.map(o => this.codeManager.getCreationStatement(o.uniqueName))

        let deletesOthers = false;
        for (const i of statements) {
            const creates = this.codeManager.getCreatedRegisterForStatement(i);
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
                text: `Deleting this will delete other statement or objects that depend on this`,
                caption: "Delete object?",
                yesButtonTextId: "Yes, delete",
                noButtonTextId: "No, keep object"
            })

            if (reason === DialogCloseReason.YES) {
                this.state.removeStatements(statements);
            }
        } else {
            this.state.removeStatements(statements);
        }
    }
}