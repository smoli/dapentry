import {Operation} from "../interpreter/Operation";
import {Parameter} from "../interpreter/Parameter";
import {Interpreter} from "../interpreter/Interpreter";
import {GrObject} from "../../controls/drawing/Objects/GrObject";


export class GfxOperation extends Operation {

    private readonly _target: Parameter;

    constructor(opcode:string, objectOrTarget:Parameter) {
        super(opcode);
        this._target = objectOrTarget;
    }

    get target():GrObject {
        return this._getParam(this._target);
    }

    set target(value) {
        this._setParam(this._target, value);
    }

}

export function makeGfxOperation(OpClass: (typeof Operation), objectCallBack: (GrObject) => void) {
    return class C extends OpClass {

        async execute(interpreter: Interpreter): Promise<any> {
            // objectCallBack((this as unknown as GfxOperation).target);
            return super.execute(interpreter);
        }
    }
}
