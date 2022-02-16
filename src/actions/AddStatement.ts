import {BaseAction} from "./BaseAction";

export class AddStatement extends BaseAction {
    private readonly _code: Array<string>;

    constructor(code:Array<string>) {
        super();
        this._code = code;
    }

    protected _execute(data: any): any {
        const selectedCode = this.state.store.state.code.selectedLines;

        if (selectedCode.length) {
            const index = Math.max(...selectedCode);
            this.state.insertStatements(index + 1, ...this._code);
        } else {
            this.state.addCode(this._code);
        }

    }
}