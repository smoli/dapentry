import {InterpreterError} from "./InterpreterError";

export class UnknownOpCodeError extends InterpreterError {
    public opcode: string;

    constructor(opcode: string) {
        super("Unknown OpCode " + opcode);
        this.opcode = opcode;
    }
}