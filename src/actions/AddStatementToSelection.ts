import {BaseAction} from "./BaseAction";

export class AddStatementToSelection extends BaseAction {
    private readonly _index: number;

    constructor(index: number) {
        super();
        this._index = index;
    }

    protected _execute(data: any): any {
        this.state.addToCodeSelection([this._index]);
    }
}