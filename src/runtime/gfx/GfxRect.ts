import {Parameter} from "../interpreter/Parameter";
import {Interpreter} from "../interpreter/Interpreter";
import {Point2Parameter} from "../interpreter/types/Point2Parameter";
import {GfxObject} from "./GfxObject";
import {GRRectangle} from "../../controls/Objects/GrObject";

export class GfxRect extends GfxObject {


    private _p1: Point2Parameter;
    private _width: Parameter;
    private _height: Parameter;

    constructor(opcode:string, drawing:Parameter, target:Parameter, name:Parameter, p1:Point2Parameter, w:Parameter, h:Parameter) {
        super(opcode, drawing, target, name);
        this._p1 = p1;
        this._width = w;
        this._height = h;
    }

    get p1():any {
        return this._p1.finalized(this.closure)
    }

    get width():any {
        return this._width.finalized(this.closure);
    }

    get height(): any {
        return this._height.finalized(this.closure);
    }

    async execute(interpreter: Interpreter): Promise<any> {
        const r = new GRRectangle(this.p1.x, this.p1.y, this.width, this.height);
        r.name = this.name;
        this.target = r;
        this.drawing.push(r);
    }

}