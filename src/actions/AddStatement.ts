import {BaseAction} from "./BaseAction";

export class AddStatement extends BaseAction {
    private readonly _code: Array<string>;

    constructor(code:Array<string>) {
        super();
        this._code = code;
    }

    protected _execute(data: any): any {
        this.state.addCode(this._code);
    }
}