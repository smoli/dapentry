import {BaseAction} from "./BaseAction";
import {DialogCloseReason} from "../ui/core/ModalFactory";
import {CodeManager} from "../runtime/CodeManager";
import {GrObject} from "../geometry/GrObject";
import {ASSERT} from "../core/Assertions";

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

        ASSERT(statements.length === 1, "There can only be one creation statement for an object!")

        let deletesOthers = false;
        for (const i of statements) {
            const creates = this.codeManager.getCreatedRegisterForStatement(i);
            if (creates) {
                const lines = this.codeManager.getStatementIndexesWithParticipation(creates);
                if (lines.size > 1) {
                    deletesOthers = true;
                    break;
                }
            }
        }

        if (deletesOthers) {
            const dialog = this.controller.modalFactory.createConfirmationModal();

            const { reason } = await dialog.show({
                text: `Deleting this will delete other statement or objects that depend on this`,
                caption: "Delete object?",
                yesButtonTextId: "Yes, delete",
                noButtonTextId: "No, keep object"
            })

            if (reason === DialogCloseReason.YES) {
                this.state.removeStatement(statements[0]);
            }
        } else {
            this.state.removeStatement(statements[0]);
            this._objects.forEach(o => {
                if (o.isGuide) {
                    this.state.removeGuide(o.uniqueName);
                }
            });
        }
    }
}