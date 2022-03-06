import {Parameter} from "../interpreter/Parameter";
import {getParameterConfig, GfxOperation} from "./GfxOperation";
import {GrObjectList} from "../../geometry/GrObjectList";
import {GrObject, POI, POIPurpose} from "../../geometry/GrObject";
import {Point2D} from "../../geometry/Point2D";
import {UNREACHABLE} from "../../core/Assertions";
import {scaleToAPoint} from "../../geometry/GeoMath";

export class GfxScale extends GfxOperation {
    private _factorX: Parameter;
    private _factorY: Parameter;
    private _pivot: Parameter;
    private _draggedPoint: Parameter;
    private _targetPoint: Parameter;


    constructor(opcode: string, object: Parameter, a: Parameter, b: Parameter, c: Parameter) {
        super(opcode, object);

        // SCALEP Rectangle1, top, Line1@center, bottom

        switch (getParameterConfig(a, b, c)) {
            case "PPP":
                this._factorX = a;
                this._factorY = b;
                this._pivot = c;
                break;

            case "PP":
                this._factorX = a;
                this._factorY = a;
                this._pivot = b;
                break;

            case "P@P":
                this._draggedPoint = a;
                this._targetPoint = b
                this._pivot = c;
                break;

            default:
                UNREACHABLE();
        }

    }

    get factorX(): number {
        return this._factorX.finalized(this.closure);
    }

    get factorY(): number {
        return this._factorY.finalized(this.closure);
    }

    get draggedPoint(): any {
        return this._draggedPoint.finalized(this.closure);
    }

    get targetPoint(): Point2D {
        return this._targetPoint.finalized(this.closure);
    }

    get pivot(): Point2D {
        return this.target.pointsOfInterest(POIPurpose.SCALING)[POI[this._pivot.finalized(this.closure)]]
    }

    async execute(): Promise<any> {
        let objToScale: GrObject = null;
        if (this.target instanceof GrObjectList) {
            objToScale = this.target.objects[this.target.objects.length - 1];
        } else {
            objToScale = this.target;
        }

        if (this._targetPoint) {
            let oldPoint = objToScale.pointsOfInterest(POIPurpose.SCALING)[POI[this.draggedPoint]];
            let pivot = this.pivot;
            let target = this.targetPoint;

            oldPoint = objToScale.mapPointToLocal(oldPoint);
            pivot = objToScale.mapPointToLocal(pivot);
            target = objToScale.mapPointToLocal(target);

            let { fx, fy } = scaleToAPoint(oldPoint, pivot, target);
            objToScale.scale(fx, fy, this.pivot);
        } else {
            objToScale.scale(this.factorX, this.factorY, this.pivot);
        }

    }
}
