import {Parameter} from "../interpreter/Parameter";
import {Interpreter} from "../interpreter/Interpreter";
import {Point2Parameter} from "../interpreter/types/Point2Parameter";
import {GfxObject} from "./GfxObject";
import {GrCircle} from "../../Geo/GrCircle";
import {GrObjectList} from "../../Geo/GrObjectList";
import {Point2D} from "../../Geo/Point2D";

export class GfxCircle extends GfxObject {
    private readonly _center: Point2Parameter;
    private readonly _radius: Parameter;

    constructor(opcode: string, target: Parameter, style: Parameter, center: Point2Parameter, radius: Parameter) {
        super(opcode, target, style);
        this._center = center;
        this._radius = radius;
    }

    get center(): Point2D {
        return this._center.finalized(this.closure);
    }

    set center(value) {
        this._setParam(this._center, value)
    }

    get radius(): number {
        return this._radius.finalized(this.closure);
    }

    set radius(value) {
        this._setParam(this._radius, value)
    }

    async execute(interpreter: Interpreter): Promise<any> {
        const c = GrCircle.create(this.targetName, this.center.x, this.center.y, this.radius)
        c.style = this.style;
        this.target = c;
    }


}