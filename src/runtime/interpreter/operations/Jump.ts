import {Operation} from "../Operation";
import {Parameter} from "../Parameter";

export class Jump extends Operation {

    private readonly _label: Parameter;

    constructor(opcode, label: Parameter) {
        super(opcode);
        this._label = label;
    }

    get label(): any {
        return this._label.name
    }

    async execute(interpreter): Promise<any> {
        interpreter.gotoLabel(this.label);
    }

}