import {Operation} from "../Operation";
import {Parameter} from "../Parameter";

export class Label extends Operation {

    private readonly _label: Parameter;

    constructor(opcode, label: Parameter) {
        super(opcode);
        this._label = label;
    }

    get label(): any {
        return this._getParam(this._label);
    }

    set label(value: any) {
        this._setParam(this._label, value);
    }


    async execute(interpreter): Promise<any> {
        interpreter.setLabel(this.label);
    }

}