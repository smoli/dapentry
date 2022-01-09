import {Parameter} from "../interpreter/Parameter";
import {Interpreter} from "../interpreter/Interpreter";
import {Point2Parameter} from "../interpreter/types/Point2Parameter";
import {GfxObject} from "./GfxObject";
import {GrRectangle} from "../../Geo/GrRectangle";

export class GfxRect extends GfxObject {


    private _p1: Point2Parameter;
    private _width: Parameter;
    private _height: Parameter;

    constructor(opcode:string, target:Parameter, style:Parameter, p1:Point2Parameter, w:Parameter, h:Parameter) {
        super(opcode, target, style);
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
        const r = GrRectangle.create(this.targetName, this.p1.x, this.p1.y, this.width, this.height);
        r.style = this.style;
        this.target = r;
    }

}