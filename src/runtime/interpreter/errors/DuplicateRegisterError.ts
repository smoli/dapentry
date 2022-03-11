import {InterpreterError} from "./InterpreterError";

export class DuplicateRegisterError extends InterpreterError {
    public readonly registerName: string;

    constructor(registerName: string) {
        super("Duplicate Register " + registerName);

        this.name = "DuplicateRegisterError"
        this.registerName = registerName;
    }
}
