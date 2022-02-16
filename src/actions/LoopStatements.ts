import {BaseAction} from "./BaseAction";
import {CodeManager} from "../runtime/CodeManager";
import {ASSERT} from "../core/Assertions";

export class LoopStatements extends BaseAction {
    private _indexes: Array<number>;

    constructor(statementIndexes: Array<number>) {
        super();
        this._indexes = statementIndexes;
    }

    get codeManager(): CodeManager {
        return this.state.store.state.code.codeManager;
    }

    async _execute() {
        const from = Math.min(...this._indexes);
        const to = Math.max(...this._indexes);

        const annotatedCode = this.codeManager.annotatedCode;
        const first = annotatedCode.find(c => c.originalLine === from);
        const last = annotatedCode.find(c => c.originalLine === to);

        ASSERT(!!first && !!last, "Cannot find code lines for selection");
        if (first.level !== last.level) {
            //Selection contains incomplete loop. Do nothing
            return;
        }

        if (Math.max(...annotatedCode.map(c => c.level)) !== 0) {
            const dialog = this.controller.modalFactory.createInfoModal();
            await dialog.show({
                text: "ui.infoMessages.nestedLoopsNotSupported"
            })
            return;
        }

        this.state.insertStatements(from, "DO 2");
        this.state.insertStatements(to + 2, "ENDDO");  // + 2 because indexes change when inserting "DO"
    }

}