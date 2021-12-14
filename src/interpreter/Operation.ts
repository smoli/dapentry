import {Interpreter} from "./Interpreter";

export class Operation {

    protected readonly _opcode: string;

    constructor(opcode, ..._params) {
        this._opcode = opcode;
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