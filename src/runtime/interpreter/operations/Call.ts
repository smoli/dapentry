import {Operation} from "../Operation";
import {LabelParameter, Parameter} from "../Parameter";
import {Interpreter} from "../Interpreter";
import {FunctionStackFrame} from "../FunctionStackFrame";

export class Call extends Operation {

    private static callStack: Array<any> = [];

    private readonly _label: Parameter;
    protected readonly _receiver: Parameter;
    private readonly _args: Array<Parameter>;

    constructor(opcode, p1: Parameter, p2: Parameter, ...args: Array<Parameter>) {
        super(opcode);

        this._args = [];
        if (!p2) {
            this._label = p1;
        } else {
            if (p2 instanceof LabelParameter) {
                this._receiver = p1;
                this._label = p2;
            } else {
                this._label = p1;
                this._args.push(p2);
            }
            if (args.length) {
                this._args.push(...args);
            }
        }

        if (this._receiver && !this._receiver.isRegister) {
            throw new Error("CALL: receiver must be a register")
        }
    }

    get label(): any {
        return this._label.value
    }

    async execute(interpreter: Interpreter): Promise<any> {
        const returnPoint = interpreter.pc;
        const newFrame: FunctionStackFrame = new FunctionStackFrame(null, returnPoint, this._receiver);
        interpreter.pushStack(newFrame);

        if (this._args) {
            this._args.forEach(arg => {
                Call.pushCallStack(arg.finalized(this.closure));
            })
        }

        interpreter.gotoLabel(this.label);
    }

    public static pushCallStack(value: any) {
        Call.callStack.push(value);
    }

    public static popCallStack(): any {
        return Call.callStack.pop();
    }
}
