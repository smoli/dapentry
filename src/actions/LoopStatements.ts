import {BaseAction} from "./BaseAction";
import {CodeManager} from "../runtime/CodeManager";

export class LoopStatements extends BaseAction {
    private _indexes: Array<number>;

    constructor(statementIndexes: Array<number>) {
        super();
        this._indexes = statementIndexes;
    }

    get codeManager(): CodeManager {
        return this.state.store.state.code.codeManager;
    }

    _execute() {
        const from = Math.min(...this._indexes);
        const to = Math.max(...this._indexes);
        this.state.insertStatements(from, "DO 2");
        this.state.insertStatements(to + 2, "ENDDO");  // + 2 because indexes change when inserting "DO"
    }

}