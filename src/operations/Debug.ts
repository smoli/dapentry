import {Operation} from "../Operation";
import {dbg} from "../dbg";

export class Debug extends Operation {

    private readonly _message: any;

    constructor(opcode, message) {
        super(opcode);
        this._message = message;
    }

    async execute(): Promise<any> {
        this._executed = true;
        dbg(this._message.value);
    }


}