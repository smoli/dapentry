import {Interpreter} from "./Interpreter";

export class Operation {

    protected readonly _opcode: string;
    protected _executed: boolean;


    constructor(opcode) {
        this._opcode = opcode;
        this._executed = false;
    }

    reset(): void {
        this._executed = false;
    }

    get executed(): boolean {
        return this._executed;
    }

    async execute(interpreter: Interpreter): Promise<any> {
        this._executed = true;
        throw new Error(`No execute for "${this._opcode}"`);
    }

    async update(changedRegisterName: string, interpreter: Interpreter): Promise<any> {
    }

    toString(): string {
        return `Operation ${this._opcode}`;
    }
}