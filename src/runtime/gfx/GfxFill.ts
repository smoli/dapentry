import {Operation} from "../interpreter/Operation";
import {Parameter} from "../interpreter/Parameter";
import {GrObject} from "../../controls/drawing/Objects/GrObject";

export class GfxFill extends Operation {
    private readonly _object: Parameter;
    private _color: Parameter;
    private _alpha: Parameter;



    constructor(opcode: string, object: Parameter, color: Parameter, alpha:Parameter) {
        super(opcode);

        this._object = object;
        this._color = color;
        this._alpha = alpha;
    }

    get object(): GrObject {
        return this._getParam(this._object);
    }

    get color(): string {
        return this._color.finalized(this.closure);
    }

    get alpha(): number {
        return this._alpha.finalized(this.closure);
    }

    async execute(): Promise<any> {
        this.object.fillColor = this.color;
        this.object.strokeColor = this.color;
        if (this._alpha) {
            this.object.fillOpacity = this.alpha;
        }
    }
}