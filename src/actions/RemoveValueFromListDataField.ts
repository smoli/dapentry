import {BaseAction} from "./BaseAction";

export class RemoveValueFromListDataField extends BaseAction {
    private _fieldName: string;
    private _index: number;

    constructor(fieldName: string, index: number) {
        super();
        this._fieldName =fieldName;
        this._index = index;
    }

    protected _execute(data: any): any {
        this.state.removeValueFromListOrTable(this._fieldName, this._index);
    }
}