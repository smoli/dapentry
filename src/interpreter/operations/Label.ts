import {Operation} from "../Operation";
import {Parameter} from "../Parameter";

export class Label extends Operation {

    private readonly _label: Parameter;

    constructor(opcode, label: Parameter) {
        super(opcode, label);
        this._label = label;
    }

    async execute(interpreter): Promise<any> {
        interpreter.setLabel(this._label.value);
    }

}