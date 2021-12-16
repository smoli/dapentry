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

    get test(): any {
        return this._getParam(this._test);
    }

    set test(value: any) {
        this._setParam(this._test, value);
    }

    get label(): any {
        return this._label.name
    }

    async execute(interpreter): Promise<any> {
        if (Number(this.test) !== 0) {
            interpreter.gotoLabel(this.label);
        }
    }

}