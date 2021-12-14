import {Operation} from "../../Operation";
import {Parameter} from "../../Parameter";

export class Decrement extends Operation {

    private readonly _target: Parameter;

    constructor(opcode, target: Parameter) {
        super(opcode);
        this._target = target;
    }

    async execute(interpreter): Promise<any> {
        interpreter.setRegister(this._target.name, Number(this._target.value) - 1);
    }

}