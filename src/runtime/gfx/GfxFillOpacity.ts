import {Operation} from "../interpreter/Operation";
import {Parameter} from "../interpreter/Parameter";
import {GfxOperation} from "./GfxOperation";

export class GfxFillOpacity extends GfxOperation {
    private readonly _alpha: Parameter;

    constructor(opcode: string, object: Parameter, alpha:Parameter) {
        super(opcode, object);

        this._alpha = alpha;
    }


    get alpha(): number {
        return this._alpha.finalized(this.closure);
    }

    async execute(): Promise<any> {

            this.target.fillOpacity = this.alpha;
    }
}