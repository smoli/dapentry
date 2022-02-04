import {Parameter} from "../interpreter/Parameter";
import {Interpreter} from "../interpreter/Interpreter";
import {Point2Parameter} from "../interpreter/types/Point2Parameter";
import {GfxObject} from "./GfxObject";
import {GrRectangle} from "../../geometry/GrRectangle";
import {getParameterConfig} from "./GfxOperation";
import {POI} from "../../geometry/GrObject";
import {UNREACHABLE} from "../../Assertions";

export class GfxRect extends GfxObject {


    private _p1: Point2Parameter;
    private _p2: Point2Parameter;
    private _width: Parameter;
    private _height: Parameter;

    constructor(opcode: string, target: Parameter, style: Parameter, a: Parameter | Point2Parameter, b: Parameter | Point2Parameter, c: Parameter | Point2Parameter) {
        super(opcode, target, style);

        switch (getParameterConfig(a, b, c).length) {
            case 3:
                this._p1 = a as Point2Parameter;
                this._width = b;
                this._height = c;
                break;

            case 2:
                this._p1 = a as Point2Parameter;
                this._p2 = b as Point2Parameter;

        }

    }

    get p1(): any {
        return this._p1.finalized(this.closure)
    }

    get p2(): any {
        return this._p2 && this._p2.finalized(this.closure)
    }

    get width(): any {
        return this._width.finalized(this.closure);
    }

    get height(): any {
        return this._height.finalized(this.closure);
    }

    async execute(interpreter: Interpreter): Promise<any> {
        let r: GrRectangle;
        const p1 = this.p1;
        const p2 = this.p2;
        if (this.p2) {
            const w = Math.abs(p1.x - p2.x);
            const h = Math.abs(p1.y - p2.y);
            const x = Math.min(p1.x, p2.x) + w / 2;
            const y = Math.min(p1.y, p2.y) + h / 2;
            r = GrRectangle.create(this.targetName, x, y, w, h);
        } else {

            let fx = 0;
            let fy = 0;
            switch (this.opcode) {
                case "RECT":
                case "RECTC":
                    fx = fy = 0;
                    break;

                case "RECTTL":
                    fx = fy = 1;
                    break;

                case "RECTTR":
                    fx = -1;
                    fy = 1;
                    break;
                case "RECTBL":
                    fx = 1;
                    fy = -1;
                    break;
                case "RECTBR":
                    fx = fy = -1;
                    break;

                default:
                    UNREACHABLE();
            }
            r = GrRectangle.create(this.targetName, this.p1.x + fx * this.width / 2, this.p1.y + fy * this.height / 2, this.width, this.height);
        }


        r.style = this.style;
        this.target = r;
    }

}