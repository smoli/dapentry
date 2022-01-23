import {Operation} from "../Operation";
import {Parameter} from "../Parameter";
import {Call} from "./Call";

export class FuncDecl extends Operation {

    private readonly _label: Parameter;
    private readonly _args: Array<Parameter>;

    constructor(opcode, label: Parameter, ...args: Array<Parameter>) {
        super(opcode);
        this._label = label;
        this._args = args;
        if (this._args) {
            // Argument will be on stack in reverse order
            this._args.reverse();
            this._args.forEach(args => {
                if (!args.isRegister) {
                    throw new Error(`FUNC ${this._label.value}: Arguments must be registers`)
                } else if (args.isNonLocal) {
                    throw new Error(`FUNC ${this._label.value}: Nonlocal Registers as Arguments are not alloed`)
                }
            })
        }
     }

    get label(): any {
        return this._getParam(this._label);
    }


    async execute(interpreter): Promise<any> {
        if (this._args) {
            this._args.forEach(arg => {
                this.closure.setRegister(arg.name, Call.popCallStack());
            })
        }
    }

}