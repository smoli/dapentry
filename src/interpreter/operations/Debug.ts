import {Operation} from "../Operation";

export class Debug extends Operation {

    constructor(opcode) {
        super(opcode);
    }

    async execute(interpreter): Promise<any> {
        interpreter.stop();
    }


}