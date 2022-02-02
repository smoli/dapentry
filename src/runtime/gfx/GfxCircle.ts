import {Parameter} from "../interpreter/Parameter";
import {Interpreter} from "../interpreter/Interpreter";
import {Point2Parameter} from "../interpreter/types/Point2Parameter";
import {GfxObject} from "./GfxObject";
import {GrCircle} from "../../Geo/GrCircle";
import {Point2D} from "../../Geo/Point2D";
import {AtParameter} from "../interpreter/types/AtParameter";
import {UNREACHABLE} from "../../Assertions";
import {AppConfig} from "../../AppConfig";

export class GfxCircle extends GfxObject {
    private readonly _center: Point2Parameter;
    private readonly _radius: Parameter;
    private readonly _p1: Parameter;
    private readonly _p2: Parameter;

    constructor(opcode: string, target: Parameter, style: Parameter, a: Parameter | Point2Parameter, b: Parameter) {
        super(opcode, target, style);


        switch (opcode) {
            case AppConfig.Runtime.Opcodes.Circle.Legacy:
            case AppConfig.Runtime.Opcodes.Circle.CenterRadius:
                this._center = a as Point2Parameter;

                if (b instanceof Point2Parameter || a instanceof AtParameter) {
                    this._p2 = b;
                } else {
                    this._radius = b;
                }
                break;

            case AppConfig.Runtime.Opcodes.Circle.CenterPoint:
                this._center = a as Point2Parameter;
                this._p2 = b as Point2Parameter;
                break;

            case AppConfig.Runtime.Opcodes.Circle.PointPoint:
                this._p1 = a as Point2Parameter;
                this._p2 = b as Point2Parameter;
                break;

            default:
                UNREACHABLE();

        }
    }

    async execute(interpreter: Interpreter): Promise<any> {
        let c: Point2D;
        let r: number;
        if (this._center && this._radius) {
            c = this._center.finalized(this.closure);
            r = this._radius.finalized(this.closure);

        } else if (this._center && this._p2) {
            c = this._center.finalized(this.closure);
            let d = this._p2.finalized(this.closure) as Point2D;
            r = d.copy.sub(c).length;

        } else if (!this._radius && this._p1 && this._p2) {
            let d = this._p2.finalized(this.closure) as Point2D;
            let p1 = this._p1.finalized(this.closure) as Point2D;

            d = d.copy.sub(p1).scale(0.5);
            c = p1.copy.add(d);
            r = d.length;
        } else {
            UNREACHABLE();
        }

        const ci = new GrCircle(this.targetName, c.x, c.y, r);

        ci.style = this.style;
        this.target = ci;
    }
}