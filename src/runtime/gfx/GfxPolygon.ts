import {Parameter} from "../interpreter/Parameter";
import {Interpreter} from "../interpreter/Interpreter";
import {GfxObject} from "./GfxObject";
import {ArrayParameter} from "../interpreter/types/ArrayParameter";
import {GrPolygon} from "../../geometry/GrPolygon";
import {Point2D} from "../../geometry/Point2D";

export class GfxPolygon extends GfxObject {
    private readonly _points: ArrayParameter;
    private readonly _closed: Parameter;

    constructor(opcode: string, target: Parameter, style: Parameter, points: ArrayParameter, closed: Parameter) {
        super(opcode, target, style);
        this._points = points;
        this._closed = closed;
    }

    get points(): Array<Point2D> {
        return this._points.finalized(this.closure);
    }

    get closed(): boolean {
        return !!this._closed.finalized(this.closure);
    }

    async execute(interpreter: Interpreter): Promise<any> {
        let poly: GrPolygon = this.target as GrPolygon;

        if (!poly) {
            poly = GrPolygon.create(this.targetName, this.points, this.closed)
            poly.style = this.style;
            this.target = poly;
        } else {
            for (const p of this.points) {
                poly.addPoint(p);
            }
        }
    }
}

