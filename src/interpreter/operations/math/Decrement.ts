import {Operation} from "../../Operation";
import {Parameter} from "../../Parameter";
import {Interpreter} from "../../Interpreter";

export class Decrement extends Operation {

    private readonly _target: Parameter;

    constructor(opcode, target: Parameter) {
        super(opcode, target);
        this._target = target;
    }

    async execute(interpreter): Promise<any> {
        this._target.value = this._target.value - 1;
    }

    async update(changedRegisterName: string, interpreter: Interpreter): Promise<any> {
        this._target.value = this._target.value - 1;
    }

}