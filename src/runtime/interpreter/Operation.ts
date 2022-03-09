import {Interpreter} from "./Interpreter";
import {StackFrame} from "./StackFrame";
import {Parameter} from "./Parameter";
import {ArrayIterator} from "./types/ArrayIterator";
import {ArrayParameter} from "./types/ArrayParameter";

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


    protected _getParam(param:Parameter):any {
        let r = null;
        if (param.isRegister) {
            if (param.components) {
                return this.closure.getRegisterWithComponents(param.name, param.components);
            }
            r = this.closure.getRegister(param.name);
        } else {
            r = param.finalized(this.closure);
        }

        if (r && r.finalized) {
            r = r.finalized(this.closure);
        }

        return r;
    }

    protected _paramExists(param:Parameter):boolean {
        if (!param.isRegister) {
            return true;
        }

        return this.closure.hasRegister(param.name, true);
    }

    protected _setParam(param: Parameter, value: any) {
        let lValue = value;
        if (value instanceof ArrayIterator) {
            lValue = value.finalized(this.closure);
        }
        if (param.components) {
            return this.closure.setRegisterWithComponents(param.name, param.components, lValue);
        }
        return this.closure.setRegister(param.name, lValue, param.isNonLocal);
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