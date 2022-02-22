import {Parameter} from "../interpreter/Parameter";
import {Interpreter} from "../interpreter/Interpreter";
import {GfxObject} from "./GfxObject";
import {GrLine} from "../../geometry/GrLine";
import {Point2D} from "../../geometry/Point2D";
import {GrText} from "../../geometry/GrText";


export class GfxText extends GfxObject {
    private readonly _center: Parameter;
    private readonly _text: Parameter;

    constructor(opcode: string, target: Parameter, style: Parameter, point: Parameter, text: Parameter) {
        super(opcode, target, style);
        this._text = text;
        this._center = point;
    }


    get text(): string {
        return "" + this._text.finalized(this.closure);
    }

    get center(): Point2D {
        return this._center.finalized(this.closure);
    }

    async execute(interpreter: Interpreter): Promise<any> {
        const t = new GrText(this.targetName, this.center.x, this.center.y, this.text);
        t.style = this.style;
        this.target = t;
    }
}