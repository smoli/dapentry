import {Parameter} from "../Parameter";
import {StackFrame} from "../StackFrame";

export class ArrayParameter extends Parameter {

    private _value: Array<any> = []

    constructor(value: Array<any>) {
        super(false, null)
        this._value = value;
    }

    protected _getValue(param: Parameter, closure): any {
        if (param.isRegister) {
            return closure.getRegister(param.name)
        } else {
            return param.value;
        }
    }

    get length(): number {
        return this._value.length;
    }

    public getAtIndex(index: number, closure: StackFrame): any {
        return this._getValue(this._value[index], closure);
    }

    get value(): any {
        return this._value;
    }

    finalized(closure): any {
        return [...this._value.map(v => v.finalized(closure))]
    }

}