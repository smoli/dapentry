import {Operation} from "../interpreter/Operation";
import {Parameter} from "../interpreter/Parameter";
import {Point2Parameter} from "../interpreter/types/Point2Parameter";
import {GrObject, POI} from "../../controls/drawing/Objects/GrObject";

export class GfxMove extends Operation {
    private readonly _object: Parameter;
    private _vector: Point2Parameter;
    private _targetObject: Parameter;
    private _targetPoi: Parameter;
    private _poi: Parameter;


    constructor(opcode: string, object: Parameter, poi: Parameter, vectorOrObject: Point2Parameter | Parameter, targetPoi: Parameter) {
        super(opcode);

        this._object = object;
        this._poi = poi;

        if (vectorOrObject instanceof Point2Parameter) {
            this._vector = vectorOrObject;
        } else {
            this._targetObject = vectorOrObject;
            this._targetPoi = targetPoi;
        }
    }

    get object(): GrObject {
        return this._getParam(this._object);
    }

    get poi():POI {
        return POI[this._poi.finalized(this.closure) as string];

    }

    get vector(): any {
        if (this._targetObject) {
            const p = this.object.pointsOfInterest[this.poi];

            p.x += this.object.x;
            p.y += this.object.y;

            const t = this.targetObject.pointsOfInterest[this.targetPoi];
            t.x += this.targetObject.x;
            t.y += this.targetObject.y;

            return { x: t.x - p.x, y: t.y - p.y }
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
        this.object.movePOI(this.poi, this.vector);
    }
}