import {Operation} from "../Operation";
import {Parameter} from "../Parameter";

export class PopStackFrame extends Operation {

    private readonly _returnRegister:Parameter = null;

    constructor(opcode:string, returnRegister: Parameter) {
        super(opcode);

        if (returnRegister && !returnRegister.isRegister) {
            throw new Error("POPSF: Return must be a register")
        }

        this._returnRegister = returnRegister;
    }

    async execute(interpreter): Promise<any> {
        if (this._returnRegister) {
            interpreter.popStack(this._returnRegister.name, this._returnRegister.components);
        } else {
            interpreter.popStack();
        }
    }

}