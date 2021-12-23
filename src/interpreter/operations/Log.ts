import {Operation} from "../Operation";
import {dbg} from "../../dbg";
import {Parameter} from "../Parameter";

export class Log extends Operation {

    private readonly _message: Parameter;

    constructor(opcode, message: Parameter) {
        super(opcode);
        this._message = message;
    }

    get message(): any {
        return this._getParam(this._message);
    }

    set message(value: any) {
        this._setParam(this._message, value);
    }


    async execute(interpreter): Promise<any> {
        dbg(this.message);
        this.closure.setRegister("debug-runtime", "DEBUG")
    }

}