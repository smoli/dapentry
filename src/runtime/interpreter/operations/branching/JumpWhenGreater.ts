import {Operation} from "../../Operation";
import {Parameter} from "../../Parameter";

export class JumpWhenGreater extends Operation {

    private readonly _test: Parameter;
    private readonly _reference: Parameter;
    private readonly _label: Parameter;

    constructor(opcode, test: Parameter, reference: Parameter, label: Parameter) {
        super(opcode);
        this._test = test;
        this._reference = reference;
        this._label = label;
    }


    get test(): any {
        return this._getParam(this._test);
    }

    set test(value: any) {
        this._setParam(this._test, value);
    }


    get reference(): any {
        return this._getParam(this._reference);
    }

    get label(): any {
        return this._label.value
    }
    

    async execute(interpreter): Promise<any> {
        if (this.test > this.reference) {
            interpreter.gotoLabel(this.label);
        }
    }

}
