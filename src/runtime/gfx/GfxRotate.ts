import {Operation} from "../interpreter/Operation";
import {Parameter} from "../interpreter/Parameter";
import {GrObject} from "../../Geo/GrObject";
import {GfxOperation} from "./GfxOperation";

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
        this.target.rotation = this.angle;
    }
}