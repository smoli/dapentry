import {Operation} from "../../Operation";
import {Parameter} from "../../Parameter";
import {Interpreter} from "../../Interpreter";

export class Decrement extends Operation {

    private readonly _target: Parameter;

    constructor(opcode, target: Parameter) {
        super(opcode);
        this._target = target;
    }

    get target(): any {
        return this._getParam(this._target);
    }

    set target(value: any) {
        this._setParam(this._target, value);
    }

    async execute(interpreter): Promise<any> {
        this.target = this.target - 1;
    }

    async update(changedRegisterName: string, interpreter: Interpreter): Promise<any> {
        this.target = this.target - 1;
    }

}