import {Operation} from "../interpreter/Operation";
import {Parameter} from "../interpreter/Parameter";
import {GrObject} from "../../controls/drawing/Objects/GrObject";

export class GfxFill extends Operation {
    private readonly _object: Parameter;
    private _color: Parameter;



    constructor(opcode: string, object: Parameter, color: Parameter) {
        super(opcode);

        this._object = object;
        this._color = color;
    }

    get object(): GrObject {
        return this._getParam(this._object);
    }

    get color(): string {
        return this._color.finalized(this.closure);
    }

    async execute(): Promise<any> {
        this.object.fillColor = this.color;

    }
}