import {Operation} from "../interpreter/Operation";
import {Parameter} from "../interpreter/Parameter";

export class Circle extends Operation {

    private _center: Parameter;
    private _radius: Parameter;

    constructor(opcode, center, radius) {
        super(opcode);
        this._center = center;
        this._radius = radius;
    }

    get center():any {
        return this._center.finalized(this.closure)
    }

    set center(value) {
        this._setParam(this._center, value)
    }

    get radius():any {
        return this._getParam(this._radius)
    }

    set radius(value) {
        this._setParam(this._radius, value)
    }


}