import {Parameter} from "../interpreter/Parameter";
import {Interpreter} from "../interpreter/Interpreter";
import {Point2Parameter} from "../interpreter/types/Point2Parameter";
import {GfxObject} from "./GfxObject";
import {GrLine} from "../../Geo/GrLine";
import {getParameterConfig} from "./GfxOperation";
import {GrObject, POI} from "../../Geo/GrObject";
import {Point2D} from "../../Geo/Point2D";


export class GfxLine extends GfxObject {
    private readonly _p1: Parameter;
    private readonly _p2: Parameter;

    constructor(opcode: string, target: Parameter, style: Parameter, a: Parameter, b: Parameter, c: Parameter, d: Parameter) {
        super(opcode, target, style);
        this._p1 = a;
        this._p2 = b;
    }


    get p1(): Point2D {
        return this._p1.finalized(this.closure);
    }

    get p2(): Point2D {
        return this._p2.finalized(this.closure);
    }

    async execute(interpreter: Interpreter): Promise<any> {
        const c = GrLine.create(this.targetName, this.p1.x, this.p1.y, this.p2.x, this.p2.y)
        c.style = this.style;
        this.target = c;

    }


}