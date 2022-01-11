import {Operation} from "../Operation";
import {Parameter} from "../Parameter";
import {FunctionStackFrame} from "../FunctionStackFrame";

export class Call extends Operation {

    private readonly _label: Parameter;
    private readonly _receiver: Parameter;

    constructor(opcode, p1: Parameter, p2: Parameter) {
        super(opcode);
        if (p2) {
            this._label = p2;
            this._receiver = p1;

            if (!this._receiver.isRegister) {
                throw new Error("CALL: receiver must be a register")
            }
        } else {
            this._label = p1;
        }
    }

    get label(): any {
        return this._label.value
    }

    async execute(interpreter): Promise<any> {
        const returnPoint = interpreter.pc;
        const newFrame: FunctionStackFrame = new FunctionStackFrame(null, returnPoint, this._receiver);
        interpreter.pushStack(newFrame);
        interpreter.gotoLabel(this.label);
    }

}
