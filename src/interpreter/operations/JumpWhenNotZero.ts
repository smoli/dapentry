import {Operation} from "../Operation";
import {Parameter} from "../Parameter";

export class JumpWhenNotZero extends Operation {

    private readonly _test: Parameter;
    private readonly _label: Parameter;

    constructor(opcode, test: Parameter, label: Parameter) {
        super(opcode);
        this._test = test;
        this._label = label;
    }

    async execute(interpreter): Promise<any> {
        if (Number(this._test.value) !== 0) {
            interpreter.gotoLabel(this._label.name);
        }
    }

}