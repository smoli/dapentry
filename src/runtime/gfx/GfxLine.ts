import {Parameter} from "../interpreter/Parameter";
import {Interpreter} from "../interpreter/Interpreter";
import {Point2Parameter} from "../interpreter/types/Point2Parameter";
import {GrCircle, GrLine, Point2D} from "../../controls/drawing/Objects/GrObject";
import {GfxObject} from "./GfxObject";

export class GfxLine extends GfxObject {
    private readonly _p1: Point2Parameter;
    private readonly _p2: Parameter;

    constructor(opcode:string, drawing:Parameter, target:Parameter, name:Parameter, style:Parameter, p1:Point2Parameter, p2:Point2Parameter) {
        super(opcode, drawing, target, name, style);
        this._p1 = p1;
        this._p2 = p2;
    }

    get p1():Point2D {
        return this._p1.finalized(this.closure);
    }

    set p1(value) {
        this._setParam(this._p1, value)
    }

    get p2():Point2D {
        return this._p2.finalized(this.closure);
    }

    set p2(value) {
        this._setParam(this._p2, value)
    }

    async execute(interpreter: Interpreter): Promise<any> {
        const c = GrLine.create(this.name, this.p1.x, this.p1.y, this.p2.x, this.p2.y)
        c.style = this.style;
        this.target = c;

        this.drawing.push(c);
    }


}