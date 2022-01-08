import {Parameter} from "../interpreter/Parameter";
import {Interpreter} from "../interpreter/Interpreter";
import {Point2Parameter} from "../interpreter/types/Point2Parameter";
import {GfxObject} from "./GfxObject";
import {GrLine} from "../../controls/drawing/Objects/GrLine";
import {Point2D} from "../../controls/drawing/Objects/GeoMath";
import {getParameterConfig} from "./GfxOperation";


export class GfxLine extends GfxObject {
    private readonly _p1: Point2Parameter;
    private readonly _p2: Parameter;
    private _fromObject: Parameter;
    private _fromPoint: Parameter;
    private _toObject: Parameter;
    private _toPoint: Parameter;

    constructor(opcode: string, target: Parameter, style: Parameter, a: Parameter, b: Parameter, c: Parameter, d: Parameter) {
        super(opcode, target, style);

        switch (getParameterConfig(a, b, c, d)) {
            case "22" :
                this._p1 = a as Point2Parameter;
                this._p2 = b as Point2Parameter;
                break;

            case "PP2":
                this._fromObject = a;
                this._fromPoint = b;
                this._p2 = c as Point2Parameter;
                break;

            case "2PP":
                this._p1 = a as Point2Parameter;
                this._toObject = b;
                this._toPoint = c;
                break;

            case "PPPP":
                this._fromObject = a;
                this._fromPoint = b;
                this._toObject = c;
                this._toPoint = d;
                break;
        }

    }

    get fromPoi(): Point2D {
        return this.objPoiToPoint(this._fromObject, this._fromPoint);
    }

    get p1(): Point2D {
        if (this._fromObject) {
            return this.fromPoi;
        }
        return this._p1.finalized(this.closure);
    }

    get toPoi(): Point2D {
        return this.objPoiToPoint(this._toObject, this._toPoint);
    }

    get p2(): Point2D {
        if (this._toObject) {
            return this.toPoi;
        }
        return this._p2.finalized(this.closure);
    }

    async execute(interpreter: Interpreter): Promise<any> {
        const c = GrLine.create(this.targetName, this.p1.x, this.p1.y, this.p2.x, this.p2.y)
        c.style = this.style;
        this.target = c;

    }


}