import {Operation} from "../Operation";
import {Parameter} from "../Parameter";
import {FunctionStackFrame} from "../FunctionStackFrame";

export class Return extends Operation {

    private readonly _returnRegister:Parameter = null;

    constructor(opcode:string, returnRegister: Parameter) {
        super(opcode);

        if (returnRegister && !returnRegister.isRegister) {
            throw new Error("POPSF: Return must be a register")
        }

        this._returnRegister = returnRegister;
    }

    async execute(interpreter): Promise<any> {
        if (!(this.closure instanceof FunctionStackFrame)) {
            throw new Error("RET: This is not inside a called function")
        }
        const returnPoint = (this.closure as FunctionStackFrame).returnPoint;
        const receiver = (this.closure as FunctionStackFrame).receiver;
        if (this._returnRegister) {
            interpreter.popStack(this._returnRegister, receiver);
        } else {
            interpreter.popStack();
        }
        interpreter.setPC(returnPoint);
    }

}