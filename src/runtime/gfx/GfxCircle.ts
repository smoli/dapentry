import {Parameter} from "../interpreter/Parameter";
import {Interpreter} from "../interpreter/Interpreter";
import {Point2Parameter} from "../interpreter/types/Point2Parameter";
import {GRCircle} from "../../controls/Objects/GrObject";
import {GfxObject} from "./GfxObject";

export class GfxCircle extends GfxObject {
    private readonly _center: Point2Parameter;
    private readonly _radius: Parameter;

    constructor(opcode:string, drawing:Parameter, target:Parameter, name:Parameter, center:Point2Parameter, radius:Parameter) {
        super(opcode, drawing, target, name);
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

    async execute(interpreter: Interpreter): Promise<any> {
        const c = new GRCircle(this.center.x, this.center.y, this.radius)
        c.name = this.name;
        this.target = c;

        this.drawing.push(c);
    }


}