import {Operation} from "../Operation";
import {dbg} from "../../dbg";
import {Parameter} from "../Parameter";

export class Log extends Operation {

    private readonly _message: Parameter;

    constructor(opcode, message: Parameter) {
        super(opcode, message);
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