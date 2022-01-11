import {Operation} from "../interpreter/Operation";
import {Parameter} from "../interpreter/Parameter";
import {GrObject, POI} from "../../Geo/GrObject";
import {GfxOperation} from "./GfxOperation";
import {GrObjectList} from "../../Geo/GrObjectList";

export class GfxRotate extends GfxOperation {
    private _angle: Parameter;


    constructor(opcode: string, object: Parameter, angle: Parameter) {
        super(opcode, object);

        this._angle = angle;
    }

    get angle(): number {
        return this._angle.finalized(this.closure);
    }

    async execute(): Promise<any> {
        if (this.target instanceof GrObjectList) {
            this.target.objects[this.target.objects.length - 1].rotate(this.angle);
        } else {
            this.target.rotate(this.angle);
        }
    }
}
