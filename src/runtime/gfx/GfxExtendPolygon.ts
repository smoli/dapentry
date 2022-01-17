import {GfxObject} from "./GfxObject";
import {ArrayParameter} from "../interpreter/types/ArrayParameter";
import {Parameter} from "../interpreter/Parameter";
import {Point2D} from "../../Geo/Point2D";
import {Interpreter} from "../interpreter/Interpreter";
import {GrPolygon} from "../../Geo/GrPolygon";

export class GfxExtendPolygon extends GfxObject {
    private readonly _points: ArrayParameter;

    constructor(opcode: string, target: Parameter, points: ArrayParameter) {
        super(opcode, target, null);
        this._points = points;
    }

    get points(): Array<Point2D> {
        return this._points.finalized(this.closure);
    }


    async execute(interpreter: Interpreter): Promise<any> {
        const poly: GrPolygon = this.target as GrPolygon;

        if (!poly || !(poly instanceof GrPolygon)) {
            throw new Error(this._target.name + " is not a Polygon");
        }

        for (const p of this.points) {
            poly.addPoint(p);
        }
    }
}