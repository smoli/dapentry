import {BaseAction} from "./BaseAction";
import {DataFieldValue} from "../state/modules/Data";
import {DialogCloseReason} from "../ui/core/ModalFactory";
import {CodeManager} from "../runtime/CodeManager";
import {AppConfig} from "../core/AppConfig";

export class DeleteStatements extends BaseAction {
    private readonly _index: number;

    constructor(index: number) {
        super();
        this._index = index;
    }

    get codeManager(): CodeManager {
        return this.state.store.state.code.codeManager;
    }

    protected checkForDependentStatements() {
        let deletesOthers = false;
        let creates = null;
        creates = this.codeManager.getCreatedRegisterForStatement(this._index);
        if (creates) {
            const lines = this.codeManager.getStatementIndexesWithParticipation(creates);
            if (lines.size > 1) {
                deletesOthers = true;
            }
        }

        return { deletesOthers, creates }
    }

    protected checkForLoop() {
        const o = this.codeManager.getOpCodeForStatement(this._index);

        if (o === AppConfig.Runtime.Opcodes.ForEach ||
            o === AppConfig.Runtime.Opcodes.EndEach ||
            o === AppConfig.Runtime.Opcodes.Do ||
            o === AppConfig.Runtime.Opcodes.EndDo
        ) {
            return true;
        }
    }

    protected async _execute(data: any): Promise<any> {
        const { deletesOthers, creates } = this.checkForDependentStatements();

        if (deletesOthers) {
            const dialog = this.controller.modalFactory.createConfirmationModal();

            const reason = await dialog.show({
                text: `This statement creates "${creates}". It is used in other statements that must also be deleted.`,
                caption: "Delete statement for object?",
                yesButtonTextId: "Yes, delete",
                noButtonTextId: "No, keep statement"
            })

            if (reason === DialogCloseReason.YES) {
                this.state.removeStatement(this._index);
            }
        } else {
            this.state.removeStatement(this._index);
        }
    }
}