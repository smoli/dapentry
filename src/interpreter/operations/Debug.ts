import {Operation} from "../Operation";

export class Debug extends Operation {

    private readonly _message: any;

    constructor(opcode, message) {
        super(opcode);
        this._message = message;
    }

    async execute(interpreter): Promise<any> {
        interpreter.stop();
    }


}