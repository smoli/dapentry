import {Operation} from "../interpreter/Operation";
import {Parameter} from "../interpreter/Parameter";
import {Point2Parameter} from "../interpreter/types/Point2Parameter";
import {GrObject, POI} from "../../Geo/GrObject";
import {getParameterConfig, GfxOperation} from "./GfxOperation";
import {GrObjectList} from "../../Geo/GrObjectList";
import {AtParameter} from "../interpreter/types/AtParameter";
import {Point2D} from "../../Geo/Point2D";

export class GfxMove extends GfxOperation {
    private _vector: Point2Parameter;
    private _targetPoint: Parameter;
    private _movingPoint: string | number;


    constructor(opcode: string, a: Parameter | AtParameter, b: Point2Parameter | Parameter | AtParameter) {
        let object
        let at;

        switch (getParameterConfig(a, b)) {
            case "P2":
                object = a;
                super(opcode, object);
                this._movingPoint = "center";
                this._vector = b as Point2Parameter;
                break;

            case "@2":
                object = new Parameter(true, a.name);
                super(opcode, object);
                at = a as AtParameter
                this._movingPoint = at.where;
                this._vector = b as Point2Parameter;
                break;

            case "P@":
                object = a;
                super(opcode, object);
                this._movingPoint = "center";
                this._targetPoint = b;
                break;

            case "@@":
                object = new Parameter(true, a.name);
                super(opcode, object);
                at = a as AtParameter
                this._movingPoint = at.where;
                this._targetPoint = b;
                break;
        }

    }

    get vector(): any {
        if (this._vector) {
            return this._vector.finalized(this.closure);
        }

        let from;
        if (typeof this._movingPoint === "number") {
            from = this.target.getPointAtPercentage(this._movingPoint);
        } else {
            from = this.target.pointsOfInterest[POI[this._movingPoint]];
        }

        const to = this._targetPoint.finalized(this.closure);

        return to.copy.sub(from);
    }

    async execute(): Promise<any> {
        let poi = this._movingPoint;
        if (typeof poi === "number") {
            poi = "center";
        }

        poi = POI[poi];

        if (this.target instanceof GrObjectList) {
            this.target.objects[this.target.objects.length - 1].movePOI(poi as POI, this.vector);
        } else {
            this.target.movePOI(poi as POI, this.vector);
        }
    }
}