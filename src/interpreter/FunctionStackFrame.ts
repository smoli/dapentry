import {StackFrame} from "./StackFrame";
import {Parameter} from "./Parameter";
import {Interpreter} from "./Interpreter";

export class FunctionStackFrame extends StackFrame {

    private readonly _returnPoint: number;
    private readonly _receiver: Parameter;

    constructor(parent: StackFrame, returnPoint:number, receiveName:Parameter = null) {
        super(parent);
        this._returnPoint = returnPoint;
        this._receiver = receiveName
    }

    get returnPoint():number {
        return this._returnPoint;
    }

    get receiver():Parameter {
        return this._receiver;
    }


    async update(name: string, value: any, interpreter: Interpreter): Promise<any> {
        this.setRegister(name, value);
        for (const op of this._operations) {
            const saveClosure = op.closure;
            op.setClosure(this)
            await op.update(name, interpreter);
            op.setClosure(saveClosure);
        }
    }
}