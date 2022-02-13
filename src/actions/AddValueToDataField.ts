import {BaseAction} from "./BaseAction";

export class AddValueToDataField extends BaseAction {
    private _fieldName: string;
    private _value: number | string;

    constructor(fieldName: string, value: (number | string)) {
        super();
        this._fieldName =fieldName;
        this._value = value;
    }

    protected _execute(data: any): any {
        this.state.addValueToDataField(this._fieldName, this._value);
    }
}