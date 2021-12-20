import {Parameter} from "../Parameter";
import {IInterpreterType} from "./IInterpreterType";

export class ArrayParameter implements IInterpreterType {

    private _value: Array<any> = []

    constructor(value:Array<any>) {
        this._value = value;
    }

    protected _getValue(param:Parameter, closure):any {
        if (param.isRegister) {
            return closure.getRegister(param.name)
        } else {
            return param.value;
        }
    }

    public getValue(closure) {
        return this._value.map(p => this._getValue(p, closure));
    }

}