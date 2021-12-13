import {Interpreter} from "./Interpreter";

export class Parameter {
    private readonly _isRegister: boolean = false;
    private readonly _value: any = null;
    private _interpreter:Interpreter = null;

    constructor(isRegister:boolean, value:any, interpreter:Interpreter) {
        this._interpreter = interpreter;
        this._value = value;
        this._isRegister = isRegister;
    }

    get isRegister(): boolean {
        return this._isRegister
    }

    get value(): string {
        if (this._isRegister) {
            return this._interpreter.getRegister(this._value)
        }
        return this._value
    }

    get name(): string {
        if (this._isRegister) {
            return this._value;
        }
        throw new Error("This param is a value and has no name");
    }
}