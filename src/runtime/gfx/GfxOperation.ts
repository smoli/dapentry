import {Operation} from "../interpreter/Operation";
import {Parameter} from "../interpreter/Parameter";
import {GrObject} from "../../controls/drawing/Objects/GrObject";
import {GrObjectList} from "../../controls/drawing/Objects/GrObjectList";


export class GfxOperation extends Operation {

    private readonly _target: Parameter;

    constructor(opcode: string, objectOrTarget: Parameter) {
        super(opcode);
        this._target = objectOrTarget;
    }

    get target(): GrObject {
        return this._getParam(this._target);
    }

    get targetName(): string {
        return this._target.name;
    }

    set target(value) {
        if (this.target) {
            if (!(this.target as any instanceof GrObjectList)) {
                const oldValue = this.target;
                this._setParam(this._target, new GrObjectList(this.targetName));
                (this.target as GrObjectList).objects.push(oldValue);
            }
            (this.target as GrObjectList).objects.push(value);
        } else {
            this._setParam(this._target, value);
        }
    }

}

