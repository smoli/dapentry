import {Operation} from "../interpreter/Operation";
import {Parameter} from "../interpreter/Parameter";
import {GfxOperation} from "./GfxOperation";

export class GfxFill extends GfxOperation {
    private readonly _color: Parameter;
    private readonly _alpha: Parameter;

    constructor(opcode: string, object: Parameter, color: Parameter, alpha:Parameter) {
        super(opcode, object);

        this._color = color;
        this._alpha = alpha;
    }

    get color(): string {
        return this._color.finalized(this.closure);
    }

    get alpha(): number {
        return this._alpha.finalized(this.closure);
    }

    async execute(): Promise<any> {
        this.target.fillColor = this.color;
        this.target.strokeColor = this.color;
        if (this._alpha) {
            this.target.fillOpacity = this.alpha;
        }
    }
}