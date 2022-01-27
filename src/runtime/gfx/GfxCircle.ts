import {Parameter} from "../interpreter/Parameter";
import {Interpreter} from "../interpreter/Interpreter";
import {Point2Parameter} from "../interpreter/types/Point2Parameter";
import {GfxObject} from "./GfxObject";
import {GrCircle} from "../../Geo/GrCircle";
import {GrObjectList} from "../../Geo/GrObjectList";
import {Point2D} from "../../Geo/Point2D";
import {AtParameter} from "../interpreter/types/AtParameter";

export class GfxCircle extends GfxObject {
    private readonly _center: Point2Parameter;
    private readonly _radius: Parameter;
    private readonly _p2: Parameter;

    constructor(opcode: string, target: Parameter, style: Parameter, center: Point2Parameter, a: Parameter) {
        super(opcode, target, style);
        this._center = center;

        if (a instanceof Point2Parameter || a instanceof AtParameter) {
            this._p2 = a;
        } else {
            this._radius = a;
        }

    }

    get center(): Point2D {
        return this._center.finalized(this.closure);
    }


    get radius(): number {
        return this._radius.finalized(this.closure);
    }

    get p2(): Point2D {
        return this._p2 && this._p2.finalized(this.closure);
    }


    async execute(interpreter: Interpreter): Promise<any> {
        let c;
        if (this._p2) {
            const r = this.p2.copy.sub(this.center).length;
            c = GrCircle.create(this.targetName, this.center.x, this.center.y, r);
        } else {
            c = GrCircle.create(this.targetName, this.center.x, this.center.y, this.radius);
        }

        c.style = this.style;
        this.target = c;
    }


}