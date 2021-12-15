import {Operation} from "../Operation";
import {dbg} from "../../dbg";

export class Log extends Operation {

    private readonly _message: any;

    constructor(opcode, message) {
        super(opcode);
        this._message = message;
    }

    async execute(interpreter): Promise<any> {
        dbg(this._message.value);
        interpreter.setRegister("debug.runtime", "DEBUG")
    }

    async update(registerName, interpreter) {
        dbg(interpreter.getRegister(registerName));
    }


}