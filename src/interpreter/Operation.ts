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
            if (p && p.isRegister) {
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
}