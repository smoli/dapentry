import {Interpreter} from "./Interpreter";
import {StackFrame} from "./StackFrame";
import {Parameter} from "./Parameter";

export class Operation {

    protected readonly _opcode: string;
    protected _closure: StackFrame;
    protected _parameters: Array<Parameter>;

    constructor(opcode, ..._params: Array<Parameter>) {
        this._opcode = opcode;
        this._parameters = _params;
    }

    public setClosure(closure: StackFrame) {
        this._closure = closure;
        this._parameters.forEach(p => {
            if (p.isRegister) {
                p.setClosure(closure)
            }
        });
    }

    get closure(): StackFrame {
        return this._closure;
    }

    async execute(interpreter: Interpreter): Promise<any> {
        throw new Error(`No execute for "${this._opcode}"`);
    }

    async update(changedRegisterName: string, interpreter: Interpreter): Promise<any> {
    }

    toString(): string {
        return `Operation ${this._opcode}`;
    }

    getRegister(name: string|Parameter): any {
        if (typeof name === "string") {
            return this._closure.getRegister(name)
        } else {
            return this._closure.getRegister(name.name)
        }
    }

    setRegister(name: string|Parameter, value: any): void {
        if (typeof name === "string") {
            return this._closure.setRegister(name, value)
        } else {
            return this._closure.setRegister(name.name, value)
        }
    }
}