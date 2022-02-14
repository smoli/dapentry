import {BaseAction} from "./BaseAction";
import {DataFieldValue} from "../state/modules/Data";

export class AddNewDataField extends BaseAction {
    private readonly _value: DataFieldValue;

    constructor(value: DataFieldValue) {
        super();
        this._value = value;
    }

    protected _execute(data: any): any {
        const name = this.state.getNewDataFieldName("f");
        this.state.addDataField(name, this._value);
    }
}