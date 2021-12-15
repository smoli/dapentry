import {Operation} from "../Operation";
import {Parameter} from "../Parameter";

export class Load extends Operation {

    private readonly _target: Parameter;
    private readonly _value: Parameter;

    constructor(opcode, target: Parameter, value: Parameter) {
        super(opcode, target, value);
        this._target = target;
        this._value = value;
    }

    async execute(interpreter): Promise<any> {
        this._target.value = this._value.value;
    }

}