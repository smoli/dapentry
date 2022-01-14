import {Interpreter} from "./Interpreter";
import {StackFrame} from "./StackFrame";
import {Parameter} from "./Parameter";

export class Operation {

    protected readonly _opcode: string;
    protected _closure: StackFrame;

    constructor(opcode, ..._params: Array<Parameter>) {
        this._opcode = opcode;
    }

    public setClosure(closure: StackFrame) {
        this._closure = closure;
    }

    get closure(): StackFrame {
        return this._closure;
    }

    get opcode(): string {
        return this._opcode;
    }


    protected _getParam(param) {
        if (param.isRegister) {
            if (param.components) {
                return this.closure.getRegisterWithComponents(param.name, param.components);
            }
            return this.closure.getRegister(param.name);
        } else {
            return param.value;
        }
    }

    protected _setParam(param: Parameter, value: any) {
        if (param.components) {
            return this.closure.setRegisterWithComponents(param.name, param.components, value);
        }
        return this.closure.setRegister(param.name, value, param.isNonLocal);
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