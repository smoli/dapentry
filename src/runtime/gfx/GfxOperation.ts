import {Operation} from "../interpreter/Operation";
import {Parameter} from "../interpreter/Parameter";
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

