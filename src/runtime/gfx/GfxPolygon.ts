import {Parameter} from "../interpreter/Parameter";
import {Interpreter} from "../interpreter/Interpreter";
import {Point2Parameter} from "../interpreter/types/Point2Parameter";
import {GfxObject} from "./GfxObject";
import {GrCircle} from "../../Geo/GrCircle";
import {GrLine} from "../../Geo/GrLine";
import {Point2D} from "../../Geo/GeoMath";
import {ArrayParameter} from "../interpreter/types/ArrayParameter";
import {GrPolygon} from "../../Geo/GrPolygon";

export class GfxPolygon extends GfxObject {
    private readonly _points: ArrayParameter;
    private readonly _closed: Parameter;

    constructor(opcode:string, target:Parameter, style:Parameter, points:ArrayParameter, closed:Parameter) {
        super(opcode, target, style);
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
        const c = GrPolygon.create(this.targetName, this.points, this.closed)
        c.style = this.style;
        this.target = c;
    }


}