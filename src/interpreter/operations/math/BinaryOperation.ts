import {Operation} from "../../Operation";
import {Parameter} from "../../Parameter";
import {Interpreter} from "../../Interpreter";

export class BinaryOperation extends Operation {

    protected readonly _target: Parameter;
    protected readonly _op1: Parameter;
    protected readonly _op2: Parameter;

    constructor(opcode, target: Parameter, op1: Parameter, op2?: Parameter) {
        super(opcode, target, op1,  op2);

        this._target = target;

        if (!op2) {
            this._op2 = op1;
            this._op1 = target;
        } else {
            this._op1 = op1;
            this._op2 = op2;
        }
    }

    async update(changedRegisterName: string, interpreter: Interpreter): Promise<any> {
        return this.execute(interpreter);
    }

}