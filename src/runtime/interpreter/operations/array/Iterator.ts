import {Operation} from "../../Operation";
import {Parameter} from "../../Parameter";
import {ArrayIterator} from "../../types/ArrayIterator";

export class Iterator extends Operation {

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


    protected _setParam(param: Parameter, value: any) {
        let lValue = value;
        if (param.components) {
            return this.closure.setRegisterWithComponents(param.name, param.components, lValue);
        }
        return this.closure.setRegister(param.name, lValue, param.isNonLocal);
    }

    set target(value: any) {
        this._setParam(this._target, value);
    }

    get value(): any {
        const v = this._getParam(this._value);

        if (Array.isArray(v)) {
            return v.map(v => v instanceof Parameter ? this._getParam(v) : v)
        }

        return v;
    }

    set value(value: any) {
        this._setParam(this._value, value);
    }

    async execute(interpreter): Promise<any> {
        this.target = new ArrayIterator(this.value);
    }

}