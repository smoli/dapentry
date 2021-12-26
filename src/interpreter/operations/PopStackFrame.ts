import {Operation} from "../Operation";

export class PopStackFrame extends Operation {

    constructor(opcode: string) {
        super(opcode);
    }

    async execute(interpreter): Promise<any> {
        interpreter.popStack();
    }

}