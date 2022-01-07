import {Operation} from "../interpreter/Operation";
import {Parameter} from "../interpreter/Parameter";
import {Point2Parameter} from "../interpreter/types/Point2Parameter";
import {GrObject, POI} from "../../controls/drawing/Objects/GrObject";
import {GfxOperation} from "./GfxOperation";
import {GrObjectList} from "../../controls/drawing/Objects/GrObjectList";

export class GfxMove extends GfxOperation {
    private _vector: Point2Parameter;
    private readonly _targetObject: Parameter;
    private _targetPoi: Parameter;
    private _poi: Parameter;


    constructor(opcode: string, object: Parameter, poiOrVector: Point2Parameter | Parameter, vectorOrObject: Point2Parameter | Parameter, targetPoi: Parameter) {
        super(opcode, object);

        if (poiOrVector instanceof Point2Parameter) {
            this._poi = new Parameter(false, POI[POI.center]);
            this._vector = poiOrVector;
        } else if (vectorOrObject instanceof Point2Parameter) {
            this._poi = poiOrVector;
            this._vector = vectorOrObject;
        } else {
            this._poi = poiOrVector;
            this._targetObject = vectorOrObject;
            this._targetPoi = targetPoi;
        }
    }

    get poi(): POI {
        return POI[this._poi.finalized(this.closure) as string];

    }

    get vector(): any {
        if (this._targetObject) {
            let o1 = this.target;
            let o2 = this.targetObject;
            if (this.target === this.targetObject && this.target instanceof GrObjectList) {
                o1 = this.target.objects[this.target.objects.length - 1];
                o2 = this.target.objects[this.target.objects.length - 2];
            }
            const p = o1.pointsOfInterest[this.poi];
            const t = o2.pointsOfInterest[this.targetPoi];
            return {x: t.x - p.x, y: t.y - p.y}
        } else {
            return this._vector.finalized(this.closure);
        }
    }

    get targetObject(): GrObject {
        return this._targetObject.finalized(this.closure);
    }

    get targetPoi(): POI {
        return POI[this._targetPoi.finalized(this.closure) as string];
    }

    async execute(): Promise<any> {
        if (this.target instanceof GrObjectList) {
            this.target.objects[this.target.objects.length - 1].movePOI(this.poi, this.vector);
        } else {
            this.target.movePOI(this.poi, this.vector);
        }
    }
}