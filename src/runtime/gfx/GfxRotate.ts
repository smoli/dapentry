import {Operation} from "../interpreter/Operation";
import {Parameter} from "../interpreter/Parameter";
import {GrObject, POI} from "../../Geo/GrObject";
import {GfxOperation} from "./GfxOperation";
import {GrObjectList} from "../../Geo/GrObjectList";
import {Point2D} from "../../Geo/Point2D";

export class GfxRotate extends GfxOperation {
    private _angle: Parameter;
    private _pivot: Parameter;


    constructor(opcode: string, object: Parameter, angle: Parameter, pivot: Parameter) {
        super(opcode, object);

        this._angle = angle;
        this._pivot = pivot;
    }

    get angle(): number {
        return this._angle.finalized(this.closure);
    }

    get pivot():Point2D {
        return this._pivot && this._pivot.finalized(this.closure);
    }

    async execute(): Promise<any> {
        const p = this.pivot;

        if (this.target instanceof GrObjectList) {
            this.target.objects[this.target.objects.length - 1].rotate(this.angle, p);
        } else {
            this.target.rotate(this.angle, p);
        }
    }
}
