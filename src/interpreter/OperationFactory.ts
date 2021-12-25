import {Operation} from "./Operation";
import {Log} from "./operations/Log";
import {Debug} from "./operations/Debug";
import {Load} from "./operations/Load";
import {Add} from "./operations/math/Add";
import {Sub} from "./operations/math/Sub";
import {Decrement} from "./operations/math/Decrement";
import {Increment} from "./operations/math/Increment";
import {Multiply} from "./operations/math/Multiply";
import {Divide} from "./operations/math/Divide";
import {Exponentiate} from "./operations/math/Exponentiate";
import {Jump} from "./operations/Jump";
import {JumpWhenNotZero} from "./operations/branching/JumpWhenNotZero";
import {JumpWhenNotEqual} from "./operations/branching/JumpWhenNotEqual";
import {JumpWhenLower} from "./operations/branching/JumpWhenLower";
import {JumpWhenLowerEqual} from "./operations/branching/JumpWhenLowerEqual";
import {JumpWhenGreater} from "./operations/branching/JumpWhenGreater";
import {JumpWhenGreaterEqual} from "./operations/branching/JumpWhenGreaterEqual";
import {PushStackFrame} from "./operations/PushStackFrame";
import {PopStackFrame} from "./operations/PopStackFrame";
import {Label} from "./operations/Label";
import {SetPC} from "./operations/SetPC";
import {Call} from "./operations/Call";
import {Return} from "./operations/Return";
import {JumpWhenEqual} from "./operations/branching/JumpWhenEqual";
import {Iterator} from "./operations/Iterator";
import {IteratorNext} from "./operations/IteratorNext";
import {IteratorJumpWhenNotDone} from "./operations/IteratorJumpWhenNotDone";
import {Halt} from "./operations/Halt";

export class OperationFactory {

    private _opClasses:{ [key:string]: (typeof Operation) } = {}

    constructor() {

    }

    addOperationClass(opcode:string, cls:(typeof Operation)):void {
        this._opClasses[opcode] = cls;
    }

    create(opcode, ...params):Operation {
        const Cls:(typeof Operation) = this._opClasses[opcode];

        if (!Cls) {
            throw  new Error(`Unknown opcode "${opcode}"`)
        }

        return new Cls(opcode, ...params);
    }

}

export function defaultOperationFactory() {
    const operationFactory = new OperationFactory();

    operationFactory.addOperationClass("LOG", Log);
    operationFactory.addOperationClass("DEBUG", Debug);
    operationFactory.addOperationClass("LOAD", Load);
    operationFactory.addOperationClass("ADD", Add);
    operationFactory.addOperationClass("SUB", Sub);
    operationFactory.addOperationClass("DEC", Decrement);
    operationFactory.addOperationClass("INC", Increment);
    operationFactory.addOperationClass("MUL", Multiply);
    operationFactory.addOperationClass("DIV", Divide);
    operationFactory.addOperationClass("EXP", Exponentiate);
    operationFactory.addOperationClass("SETPC", SetPC);
    operationFactory.addOperationClass("JMP", Jump);
    operationFactory.addOperationClass("CALL", Call);
    operationFactory.addOperationClass("RET", Return);
    operationFactory.addOperationClass("JNZ", JumpWhenNotZero);
    operationFactory.addOperationClass("JEQ", JumpWhenEqual);
    operationFactory.addOperationClass("JNE", JumpWhenNotEqual);
    operationFactory.addOperationClass("JLT", JumpWhenLower);
    operationFactory.addOperationClass("JLE", JumpWhenLowerEqual);
    operationFactory.addOperationClass("JGT", JumpWhenGreater);
    operationFactory.addOperationClass("JGE", JumpWhenGreaterEqual);
    operationFactory.addOperationClass("PUSHSF", PushStackFrame);
    operationFactory.addOperationClass("POPSF", PopStackFrame);
    operationFactory.addOperationClass("ITER", Iterator);
    operationFactory.addOperationClass("NEXT", IteratorNext);
    operationFactory.addOperationClass("JINE", IteratorJumpWhenNotDone);
    operationFactory.addOperationClass("HALT", Halt);
    operationFactory.addOperationClass("___LBL___", Label);

    return operationFactory;
}