import {Operation} from "../Operation";
import {Parameter} from "../Parameter";

export class SetPC extends Operation {

    private readonly _label: Parameter;

    constructor(opcode, label: Parameter) {
        super(opcode);
        this._label = label;
    }

    async execute(interpreter): Promise<any> {
        interpreter.setPC(this._label.value);
    }

}