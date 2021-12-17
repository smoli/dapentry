import {Operation} from "../Operation";
import {Parameter} from "../Parameter";

export class Load extends Operation {

    private readonly _target: Parameter;
    private readonly _value: Parameter;

    constructor(opcode, target: Parameter, value: Parameter) {
        super(opcode);
        this._target = target;
        this._value = value;
    }

    get target(): any {
        return this._getParam(this._target);
    }

    set target(value: any) {
        this._setParam(this._target, value);
    }

    get value(): any {
        return this._getParam(this._value);
    }

    set value(value: any) {
        this._setParam(this._value, value);
    }

    async execute(interpreter): Promise<any> {
        this.target = this.value;
    }

}