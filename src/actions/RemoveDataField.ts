import {BaseAction} from "./BaseAction";
import {DataFieldValue} from "../state/modules/Data";

export class RemoveDataField extends BaseAction {
    private readonly _name: string;

    constructor(name: string) {
        super();
        this._name = name;
    }

    protected _execute(data: any): any {
        this.state.removeDataField(this._name);

    }
}