import {StackFrame} from "./StackFrame";
import {Parameter} from "./Parameter";

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

}