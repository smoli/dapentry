import {Parameter} from "../Parameter";
import {IInterpreterType} from "./IInterpreterType";
import {StackFrame} from "../StackFrame";

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

    get length():number {
        return this._value.length;
    }

    public getAtIndex(index:number, closure: StackFrame):any {
        return this._getValue(this._value[index], closure);
    }

    public getValue(closure) {
        return this._value.map(p => this._getValue(p, closure));
    }

}