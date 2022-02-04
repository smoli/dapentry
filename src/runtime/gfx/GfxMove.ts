import {Operation} from "../interpreter/Operation";
import {Parameter} from "../interpreter/Parameter";
import {Point2Parameter} from "../interpreter/types/Point2Parameter";
import {GrObject, POI} from "../../geometry/GrObject";
import {getParameterConfig, GfxOperation} from "./GfxOperation";
import {GrObjectList} from "../../geometry/GrObjectList";
import {AtParameter} from "../interpreter/types/AtParameter";
import {Point2D} from "../../geometry/Point2D";
import {AppConfig} from "../../AppConfig";
import {UNREACHABLE} from "../../Assertions";

export class GfxMove extends GfxOperation {
    private _vector: Point2Parameter;
    private _targetPoint: string | number;
    private _referencePoint: string | number;
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
                this._targetPoint = "center";
                this._vector = b as Point2Parameter;
                break;

            case "@2":
                atA = a as AtParameter
                this._targetPoint = atA.where;
                this._vector = b as Point2Parameter;
                break;

            case "P@":
                reference = new Parameter(true, b.name);
                this._reference = reference;
                this._targetPoint = "center";
                this._referencePoint = (b as AtParameter).where;
                break;

            case "@@":
                reference = new Parameter(true, b.name);
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

        if (target === reference) {
            if (target instanceof GrObjectList) {
                reference = target.objects[target.objects.length - 2];
                target = target.objects[target.objects.length - 1];
            } else {
                return new Point2D(0, 0);
            }
        }

        const from = target.at(this._targetPoint) as Point2D;
        const to = reference.at(this._referencePoint) as Point2D;

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