import {StackFrame} from "./StackFrame";

export class Parameter {
    private readonly _isRegister: boolean = false;
    private readonly _valueOrName: any = null;
    private _closure: StackFrame;

    constructor(isRegister:boolean, valueOrName:any) {
        this._valueOrName = valueOrName;
        this._isRegister = isRegister;
        this._closure = null;
    }

    get isRegister(): boolean {
        return this._isRegister
    }

    public setClosure(closure: StackFrame) {
        this._closure = closure;
    }

    get value(): any {
        if (this._isRegister) {
            return this._closure.getRegister(this._valueOrName)
        }
        return this._valueOrName
    }

    set value(value: any) {
        if (this._isRegister) {
            this._closure.setRegister(this._valueOrName, value)
        }
    }

    get name(): string {
        if (this._isRegister) {
            return this._valueOrName;
        }
        throw new Error("This param is a value and has no name");
    }
}