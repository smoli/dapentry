import {Operation} from "../interpreter/Operation";
import {Parameter} from "../interpreter/Parameter";
import {GrObject} from "../../controls/drawing/Objects/GrObject";

export class GfxRotate extends Operation {
    private readonly _object: Parameter;
    private _angle: Parameter;


    constructor(opcode: string, object: Parameter, angle:Parameter) {
        super(opcode);

        this._object = object;
this._angle = angle;
    }

    get object(): GrObject {
        return this._getParam(this._object);
    }

    get angle(): number {
        return this._angle.finalized(this.closure);
    }

    async execute(): Promise<any> {
        this.object.rotation = this.angle;
    }
}