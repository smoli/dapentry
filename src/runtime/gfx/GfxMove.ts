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
    private _targetPoint: string | number;
    private _referencePoint: string | number;
    private _reference: Parameter;


    constructor(opcode: string, a: Parameter | AtParameter, b: Point2Parameter | Parameter | AtParameter) {
        let target;
        let reference;
        let at;

        switch (getParameterConfig(a, b)) {
            case "P2":
                target = a;
                super(opcode, target);
                this._targetPoint = "center";
                this._vector = b as Point2Parameter;
                break;

            case "@2":
                target = new Parameter(true, a.name);
                super(opcode, target);
                at = a as AtParameter
                this._targetPoint = at.where;
                this._vector = b as Point2Parameter;
                break;

            case "P@":
                target = a;
                reference = new Parameter(true, b.name);

                super(opcode, target);

                this._reference = reference;
                this._targetPoint = "center";
                this._referencePoint = (b as AtParameter).where;
                break;

            case "@@":
                target = new Parameter(true, a.name);
                reference = new Parameter(true, b.name);
                super(opcode, target);

                this._reference = reference;
                this._targetPoint = (a as AtParameter).where;
                this._referencePoint = (b as AtParameter).where;

                break;

            default:
                super(opcode, null);
        }

    }

    get reference():GrObject {
        return this._reference.finalized(this.closure);
    }

    get vector(): any {
        if (this._vector) {
            return this._vector.finalized(this.closure);
        }

        let target = this.target;
        let reference = this.reference;

        if (target === reference && target instanceof GrObjectList) {
            reference = target.objects[target.objects.length - 2];
            target = target.objects[target.objects.length - 1];
        }

        const from = target.at(this._targetPoint);
        const to = reference.at(this._referencePoint);

        return to.copy.sub(from);
    }

    async execute(): Promise<any> {
        let poi = this._targetPoint
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