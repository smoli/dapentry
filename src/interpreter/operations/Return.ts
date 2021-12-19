import {Operation} from "../Operation";
import {Parameter} from "../Parameter";
import {FunctionStackFrame} from "../FunctionStackFrame";
import {Interpreter} from "../Interpreter";

export class Return extends Operation {

    private readonly _returnRegister:Parameter = null;

    constructor(opcode:string, returnRegister: Parameter) {
        super(opcode);

        if (returnRegister && !returnRegister.isRegister) {
            throw new Error("POPSF: Return must be a register")
        }

        this._returnRegister = returnRegister;
    }

    async execute(interpreter): Promise<any> {
        if (!(this.closure instanceof FunctionStackFrame)) {
            throw new Error("RET: This is not inside a called function")
        }
        const returnPoint = (this.closure as FunctionStackFrame).returnPoint;
        const receiver = (this.closure as FunctionStackFrame).receiver;
        if (this._returnRegister) {
            interpreter.popStack(this._returnRegister, receiver);
        } else {
            interpreter.popStack();
        }
        interpreter.setPC(returnPoint);
    }

    async update(changedRegisterName: string, interpreter: Interpreter): Promise<any> {
        const returnPoint = (this.closure as FunctionStackFrame).returnPoint;
        if (this._returnRegister && this.closure.parent) {
            let returnValue;

            if (this._returnRegister.components) {
                returnValue = this.closure.getRegisterWithComponents(this._returnRegister.name, this._returnRegister.components)
            } else {
                returnValue = this.closure.getRegister(this._returnRegister.name);
            }


            let lclReceiver = this._returnRegister;
            const receiver = (this.closure as FunctionStackFrame).receiver;

            if (receiver) {
                lclReceiver = receiver;
            }

            if (lclReceiver.components) {
                this.closure.parent.setRegisterWithComponents(lclReceiver.name, lclReceiver.components, returnValue);
            } else {
                this.closure.parent.setRegister(lclReceiver.name, returnValue);
            }
        }
        interpreter.setPC(returnPoint);
    }

}