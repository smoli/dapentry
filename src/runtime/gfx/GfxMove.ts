import {Operation} from "../interpreter/Operation";
import {Parameter} from "../interpreter/Parameter";
import {Point2Parameter} from "../interpreter/types/Point2Parameter";
import {GrObject, POI} from "../../geometry/GrObject";
import {getParameterConfig, GfxOperation} from "./GfxOperation";
import {GrObjectList} from "../../geometry/GrObjectList";
import {AtParameter} from "../interpreter/types/AtParameter";
import {Point2D} from "../../geometry/Point2D";
import {AppConfig} from "../../core/AppConfig";
import {UNREACHABLE} from "../../core/Assertions";

export class GfxMove extends GfxOperation {
    private _vector: Point2Parameter;
    private _targetPoint: Parameter;
    private _targetPOI: string;
    private _referencePoint: Parameter;
    private _reference: Parameter;


    constructor(opcode: string, a: Parameter | AtParameter, b: Point2Parameter | Parameter | AtParameter) {
        let target;
        let reference;
        let atA;


        const conf = getParameterConfig(a, b);

        if (conf[0] === "@") {
            target = new Parameter(true, a.name);
            atA = a as AtParameter;
        } else {
            target = a;
        }

        super(opcode, target);

        switch (getParameterConfig(a, b)) {
            case "@P":
            case "PP":
                if (opcode === AppConfig.Runtime.Opcodes.Move.AlongY) {
                    this._vector = new Point2Parameter(new Parameter(false, 0), b);
                } else if (opcode === AppConfig.Runtime.Opcodes.Move.AlongX) {
                    this._vector = new Point2Parameter(b, new Parameter(false, 0));
                } else {
                    UNREACHABLE();
                }

                break;

            case "P2":
                this._targetPOI = "center";
                this._targetPoint = new Parameter(false, "center");
                this._vector = b as Point2Parameter;
                break;

            case "@2":
                atA = a as AtParameter
                this._targetPoint = atA;
                this._targetPOI = atA.where;
                this._vector = b as Point2Parameter;
                break;

            case "P@":
                reference = new Parameter(true, b.name);
                this._reference = reference;
                this._targetPOI = "center";
                this._targetPoint = new Parameter(false, "center");
                this._referencePoint = (b as AtParameter);
                break;

            case "@@":
                reference = new Parameter(true, b.name);
                this._reference = reference;
                this._targetPoint = (a as AtParameter);
                this._targetPOI = (a as AtParameter).where;
                this._referencePoint = (b as AtParameter);

                break;

            default:
                super(opcode, null);
        }

    }

    get reference(): GrObject {
        return this._reference.finalized(this.closure);
    }

    get vector(): any {
        if (this._vector) {
            return this._vector.finalized(this.closure);
        }

        let from = this.targetPoint;
        let to = this.referencePoint;


        if (this._targetPoint.name === this._referencePoint.name) {
            // Same Object:
            if (this.target instanceof GrObjectList) {
                console.log(this.target.objects.length);
                // @ts-ignore
                from = this.target.objects[this.target.objects.length - 2].at(this._targetPoint.where) as Point2D;
                // @ts-ignore
                to = this.target.objects[this.target.objects.length - 1].at(this._referencePoint.where) as Point2D;
            } else {
                return new Point2D(0, 0);
            }
        }

        return to.copy.sub(from);
    }

    get targetPoint(): Point2D {
        return this._targetPoint.finalized(this.closure);
    }

    get referencePoint(): Point2D {
        return this._referencePoint.finalized(this.closure);
    }

    async execute(): Promise<any> {
        let poi = this._targetPOI;
        if (!isNaN(Number(poi))) {
            poi = "center";
        }

        const p = POI[poi];
        this.target.movePOI(p, this.vector);
    }
}
