import {Parameter} from "../interpreter/Parameter";
import {Interpreter} from "../interpreter/Interpreter";
import {Point2Parameter} from "../interpreter/types/Point2Parameter";
import {GfxObject} from "./GfxObject";
import {GrLine} from "../../Geo/GrLine";
import {getParameterConfig} from "./GfxOperation";
import {GrObject, POI} from "../../Geo/GrObject";
import {Point2D} from "../../Geo/Point2D";


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
            case "PP":
            case "P2":
            case "2P":
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

    get fromObject():GrObject {
        return this._fromObject.finalized(this.closure);
    }

    get fromPoint():(string|number) {
        return this._fromPoint.finalized(this.closure);
    };

    get fromPoi(): Point2D {
        return this.objPoiToPoint(this.fromObject, this.fromPoint);
    }

    get p1(): Point2D {
        if (this._fromObject) {
            return this.fromPoi;
        }
        return this._p1.finalized(this.closure);
    }

    get toObject():GrObject {
        return this._toObject.finalized(this.closure);
    }

    get toPoint():(string|number) {
        return this._toPoint.finalized(this.closure);
    };


    get toPoi(): Point2D {
        return this.objPoiToPoint(this.toObject, this.toPoint);
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