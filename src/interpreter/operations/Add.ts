import {Operation} from "../Operation";
import {Parameter} from "../Parameter";

export class Add extends Operation {

    private readonly _target: Parameter;
    private readonly _op1: Parameter;
    private readonly _op2: Parameter;

    constructor(opcode, target: Parameter, op1: Parameter, op2: Parameter) {
        super(opcode);
        this._target = target;
        this._op1 = op1;
        this._op2 = op2
    }

    async execute(interpreter): Promise<any> {
        interpreter.setRegister(this._target.name, this._op1.value + this._op2.value);
    }

}