import {Parameter} from "../interpreter/Parameter";
import {Interpreter} from "../interpreter/Interpreter";
import {GfxObject} from "./GfxObject";
import {Point2D} from "../../controls/drawing/Objects/GeoMath";
import {ArrayParameter} from "../interpreter/types/ArrayParameter";
import {GrQuadratic} from "../../controls/drawing/Objects/GrPolygon";

export class GfxQuadratic extends GfxObject {
    private readonly _points: ArrayParameter;
    private readonly _closed: Parameter;

    constructor(opcode:string, drawing:Parameter, target:Parameter, name:Parameter, style:Parameter, points:ArrayParameter, closed:Parameter) {
        super(opcode, drawing, target, name, style);
        this._points = points;
        this._closed = closed;
    }

    get points():Array<Point2D> {
        return this._points.finalized(this.closure);
    }

    get closed():boolean {
        return !!this._closed.finalized(this.closure);
    }


    async execute(interpreter: Interpreter): Promise<any> {
        const c = GrQuadratic.create(this.name, this.points, this.closed)
        c.style = this.style;
        this.target = c;

        this.drawing.push(c);
    }


}