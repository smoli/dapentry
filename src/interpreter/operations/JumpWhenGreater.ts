import {Operation} from "../Operation";
import {Parameter} from "../Parameter";

export class JumpWhenGreater extends Operation {

    private readonly _test: Parameter;
    private readonly _reference: Parameter;
    private readonly _label: Parameter;

    constructor(opcode, test: Parameter, reference: Parameter, label: Parameter) {
        super(opcode, test, reference, label);
        this._test = test;
        this._reference = reference;
        this._label = label;
    }

    async execute(interpreter): Promise<any> {
        if (this._test.value > this._reference.value) {
            interpreter.gotoLabel(this._label.name);
        }
    }

}